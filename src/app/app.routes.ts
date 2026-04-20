import { Route } from '@angular/router';

import { allowNonSuaadhyaUserGuard } from '@erp-services/data-access/settings/guards';
import { RouteConfig } from '../../libs/auditServices/shared/src';
import { cookieAuthGuard } from './guards/cookie-auth.guard';

/**
 * Application Routes with Cookie-based Authentication
 * All routes except login require valid authentication token in cookies
 */
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
    canActivate: [cookieAuthGuard], // Protect with cookie-based auth
  },
  {
    path: RouteConfig.Logout.path,
    loadComponent: () =>
      import('./components/logout/logout.component').then(
        (m) => m.LogoutComponent,
      ),
    title: RouteConfig.Logout.title,
    canActivate: [cookieAuthGuard, allowNonSuaadhyaUserGuard], // Protect and allow logout
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
    canMatch: [cookieAuthGuard], // Protect dashboard and all child routes
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
