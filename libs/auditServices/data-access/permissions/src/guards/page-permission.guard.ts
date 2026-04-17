import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { isAuthenticated } from '@erp-services/shared/helpers/guard';

import { PagePermissionsService } from '../services';

export const pagePermissionGuard: CanActivateFn = (route) => {
  const pagePermissionService = inject(PagePermissionsService);
  const router = inject(Router);

  const requiredPermission = route.data['pageViewRequest'];

  return isAuthenticated(
    pagePermissionService.hasPageAccess(requiredPermission),
    router,
  );
};
