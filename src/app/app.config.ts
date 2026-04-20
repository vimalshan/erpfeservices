import { HttpEvent, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  CSP_NONCE,
  ErrorHandler,
  importProvidersFrom,
  isDevMode,
  LOCALE_ID,
  provideAppInitializer,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { ApolloLink, InMemoryCache, Observable } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { provideTransloco } from '@jsverse/transloco';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import {
  NgxsRouterPluginModule,
  RouterStateSerializer,
} from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { Apollo, APOLLO_NAMED_OPTIONS, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { DialogService } from 'primeng/dynamicdialog';
import Aura from '@primeng/themes/aura';

// import {
//   LoggingService,
//   spinnerInterceptor,
//   SpinnerService,
// } from '@erp-services/core';
// import { UnreadActionsState } from '@erp-services/data-access/actions/state/unread-actions.state';
// import { GlobalState } from '@erp-services/data-access/global/state/global.state';
// import { UnreadNotificationsState } from '@erp-services/data-access/notifications/state/unread-notifications.state';
// import { SettingsState } from '@erp-services/data-access/settings/state/settings.state';
// import { environment } from '@erp-services/environments';
// import { OverviewSharedState } from '@erp-services/overview-shared';
// import {
//   appInitializer,
//   loggingInitializer,
// } from '@erp-services/permissions';
// import { PreferenceState } from '@erp-services/preferences/state/preference.state';
// import { CustomRouterStateSerializer } from '@erp-services/router';
// import { Language } from '@erp-services/shared/models';
// import {
//   LocaleService,
//   registerLocales,
// } from '@erp-services/shared/services/locale';

import { appRoutes } from './app.routes';
import {
  customHeaderInterceptor,
  errorInterceptor,
  GlobalErrorHandler,
} from './interceptors';
import { apiInterceptor } from './interceptors/api.interceptor';
import { cookieAuthTokenInterceptor } from './interceptors/cookie-auth-token.interceptor';
import { TranslocoHttpLoader } from './transloco-http.loader';
import { Language, LocaleService, registerLocales } from '../../libs/auditServices/shared/src';
import { appInitializer, loggingInitializer } from '../../libs/auditServices/data-access/permissions/src';
import { PreferenceState } from '../../libs/auditServices/data-access/preferences/src/state';
import { SettingsState } from '../../libs/auditServices/data-access/settings/src/state/settings.state';
import { OverviewSharedState } from '../../libs/auditServices/data-access/overview-shared/src';
import { CustomRouterStateSerializer } from '../../libs/auditServices/data-access/router/src';
import { environment } from '../../libs/auditServices/environments/src';
import { UnreadActionsState } from '../../libs/auditServices/data-access/actions/src';
import { UnreadNotificationsState } from '../../libs/auditServices/data-access/notifications/src';
import { GlobalState } from '../../libs/auditServices/data-access/global/src/state/global.state';
import { mySpinnerInterceptor } from '../../libs/core/src/spinner/spinner.interceptor';
import { LoggingService, SpinnerService } from '../../libs/core/src';


declare global {
  /* eslint-disable no-var, vars-on-top */
  var suaadhyaRandomNonce: string;
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const loggingService = new LoggingService();

  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      loggingService.logTrace(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) {
    loggingService.logTrace(`[Network error]: ${networkError}`);
  }
});

registerLocales();

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(loggingInitializer),
    provideHttpClient(
      withInterceptors([
        cookieAuthTokenInterceptor,
        apiInterceptor,
        customHeaderInterceptor,
        errorInterceptor,
        mySpinnerInterceptor,
      ]),
    ),

    provideAppInitializer(appInitializer),
    provideRouter(appRoutes, withDisabledInitialNavigation()),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: DialogService },
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideHttpClient(),
    importProvidersFrom(
      NgxsModule.forRoot(
        [
          UnreadActionsState,
          PreferenceState,
          SettingsState,
          OverviewSharedState,
          UnreadNotificationsState,
          GlobalState,
        ],
        {
          developmentMode: !environment.production,
          compatibility: {
            strictContentSecurityPolicy: true,
          },
        },
      ),
      NgxsDispatchPluginModule.forRoot(),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      NgxsRouterPluginModule.forRoot(),
    ),
    {
      provide: CSP_NONCE,
      useValue: globalThis.suaadhyaRandomNonce,
    },
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: [Language.English, Language.Italian],
        defaultLang: Language.English,
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: LOCALE_ID,
      useFactory: (localeService: LocaleService): string =>
        localeService.getLocale(),
      deps: [LocaleService],
    },
    {
      provide: APOLLO_NAMED_OPTIONS, // <-- Different from standard initialization
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          audit: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                uri: environment.auditGraphqlHost,
                withCredentials: false,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
          finding: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                uri: environment.findingGraphqlHost,
                withCredentials: false,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
          certificate: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                uri: environment.certificateGraphqlHost,
                withCredentials: false,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
          schedule: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                uri: environment.scheduleGraphqlHost,
                withCredentials: false,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
          invoice: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                uri: environment.invoicesGraphqlHost,
                withCredentials: false,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
          contact: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                uri: environment.contactGraphqlHost,
                withCredentials: false,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
          notification: {
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              errorLink,
              httpLink.create({
                uri: environment.notificationGraphqlHost,
                withCredentials: false,
              }),
            ]),
            defaultOptions: {
              query: {
                errorPolicy: 'ignore',
              },
            },
          },
        };
      },
      deps: [HttpLink],
    },
    Apollo,
    SpinnerService,
    MessageService,
  ],
};
function spinnerInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  throw new Error('Function not implemented.');
}

