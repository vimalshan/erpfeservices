import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SettingsCoBrowsingStoreService } from '../state/store-services/settings-co-browsing-store.service';

export const allowNonDnvUserGuard: CanActivateFn = () => {
  const settingsCoBrowsingStoreService = inject(SettingsCoBrowsingStoreService);
  const router = inject(Router);

  return settingsCoBrowsingStoreService.isDnvUser()
    ? router.createUrlTree([''])
    : true;
};
