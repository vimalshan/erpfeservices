import { computed, Injectable } from '@angular/core';

import { ProfileStoreService } from '@customer-portal/data-access/settings';
import { isValidKey } from '@customer-portal/data-access/settings/helpers';

@Injectable({
  providedIn: 'root',
})
export class PagePermissionsService {
  readonly userPermissions = computed(
    () => this.profileStoreService.profileInformation().accessLevel,
  );

  constructor(private readonly profileStoreService: ProfileStoreService) {}

  hasPageAccess = (requiredPermission: string): boolean =>
    isValidKey(requiredPermission, this.userPermissions(), false) || false;
}
