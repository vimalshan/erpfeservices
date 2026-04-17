import { Route } from '@angular/router';

import { allowNonDnvUserGuard } from '@customer-portal/data-access/settings/guards';
import { authGuard, RouteConfig } from '../../libs/shared/src';


export const appRoutes: Route[] = [
  {
    path: RouteConfig.Login.path,
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    title: RouteConfig.Login.title,
  },
  {
    path: RouteConfig.Welcome.path,
    loadComponent: () =>
      import('./components/welcome/welcome.component').then(
        (m) => m.WelcomeComponent,
      ),
    title: RouteConfig.Welcome.title,
  },
  {
    path: RouteConfig.Logout.path,
    loadComponent: () =>
      import('./components/logout/logout.component').then(
        (m) => m.LogoutComponent,
      ),
    title: RouteConfig.Logout.title,
    canActivate: [allowNonDnvUserGuard],
  },
  {
    path: RouteConfig.Error.path,
    loadComponent: () =>
      import('./components/error/error.component').then(
        (m) => m.ErrorComponent,
      ),
    title: RouteConfig.Error.title,
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./components/layout/layout.routes').then((r) => r.LAYOUT_ROUTES),
    canMatch: [authGuard],
  },
  {
    path: '',
    redirectTo: RouteConfig.Login.path,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: RouteConfig.Error.path,
  },
];
