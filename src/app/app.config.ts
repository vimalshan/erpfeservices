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
import { DialogService } from 'primeng/dynamicdialog';

// import {
//   LoggingService,
//   spinnerInterceptor,
//   SpinnerService,
// } from '@customer-portal/core';
// import { UnreadActionsState } from '@customer-portal/data-access/actions/state/unread-actions.state';
// import { GlobalState } from '@customer-portal/data-access/global/state/global.state';
// import { UnreadNotificationsState } from '@customer-portal/data-access/notifications/state/unread-notifications.state';
// import { SettingsState } from '@customer-portal/data-access/settings/state/settings.state';
// import { environment } from '@customer-portal/environments';
// import { OverviewSharedState } from '@customer-portal/overview-shared';
// import {
//   appInitializer,
//   loggingInitializer,
// } from '@customer-portal/permissions';
// import { PreferenceState } from '@customer-portal/preferences/state/preference.state';
// import { CustomRouterStateSerializer } from '@customer-portal/router';
// import { Language } from '@customer-portal/shared/models';
// import {
//   LocaleService,
//   registerLocales,
// } from '@customer-portal/shared/services/locale';

import { appRoutes } from './app.routes';
import {
  customHeaderInterceptor,
  errorInterceptor,
  GlobalErrorHandler,
} from './interceptors';
import { apiInterceptor } from './interceptors/api.interceptor';
import { TranslocoHttpLoader } from './transloco-http.loader';
import { Language, LocaleService, registerLocales } from '../../libs/shared/src';
import { appInitializer, loggingInitializer } from '../../libs/data-access/permissions/src';
import { PreferenceState } from '../../libs/data-access/preferences/src/state';
import { SettingsState } from '../../libs/data-access/settings/src/state/settings.state';
import { OverviewSharedState } from '../../libs/data-access/overview-shared/src';
import { CustomRouterStateSerializer } from '../../libs/data-access/router/src';
import { environment } from '../../libs/environments/src';
import { UnreadActionsState } from '../../libs/data-access/actions/src';
import { UnreadNotificationsState } from '../../libs/data-access/notifications/src';
import { GlobalState } from '../../libs/data-access/global/src/state/global.state';
import { mySpinnerInterceptor } from '../../libs/core/src/spinner/spinner.interceptor';
import { LoggingService, SpinnerService } from '../../libs/core/src';


declare global {
  /* eslint-disable no-var, vars-on-top */
  var dnvRandomNonce: string;
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
      useValue: globalThis.dnvRandomNonce,
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
                withCredentials: true,
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
                withCredentials: true,
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
                withCredentials: true,
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
                withCredentials: true,
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
                withCredentials: true,
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
                withCredentials: true,
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
                withCredentials: true,
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

