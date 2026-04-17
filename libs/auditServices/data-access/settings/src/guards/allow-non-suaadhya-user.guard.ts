import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SettingsCoBrowsingStoreService } from '../state/store-services/settings-co-browsing-store.service';

export const allowNonSuaadhyaUserGuard: CanActivateFn = () => {
  const settingsCoBrowsingStoreService = inject(SettingsCoBrowsingStoreService);
  const router = inject(Router);

  return settingsCoBrowsingStoreService.isSuaadhyaUser()
    ? router.createUrlTree([''])
    : true;
};
