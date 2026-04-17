import { GridConfig } from '@customer-portal/shared';

import {
  SettingsCompanyDetailsCountryListModel,
  SettingsCompanyDetailsEditParams,
  SettingsCompanyDetailsModel,
} from '../../models';

export class LoadSettingsCompanyDetails {
  static readonly type = '[Settings] Load Company Details';
}

export class LoadSettingsCompanyDetailsSuccess {
  static readonly type = '[Settings] Load Company Details Success';

  constructor(public companyDetails: SettingsCompanyDetailsModel) {}
}

export class LoadSettingsCompanyDetailsCountryList {
  static readonly type = '[Settings] Load Company Details Country List';
}

export class LoadSettingsCompanyDetailsCountryListSuccess {
  static readonly type = '[Settings] Load Company Details Country List Success';

  constructor(public data: SettingsCompanyDetailsCountryListModel) {}
}

export class SetCompanyDetailsAdminStatus {
  static readonly type = '[Settings] Set Company Details Admin Status';

  constructor(public isUserAdmin: boolean) {}
}

export class UpdateSettingsCompanyDetails {
  static readonly type = '[Settings] Update Company Details';

  constructor(public params: SettingsCompanyDetailsEditParams) {}
}

export class UpdateSettingsCompanyDetailsEntityListFilterOptions {
  static readonly type =
    '[Settings] Update Company Details Entity List Filter Options';
}

export class UpdateSettingsCompanyDetailsEntityListGridConfig {
  static readonly type =
    '[Settings] Update Company Details Entity List Grid Config';

  constructor(public legalEntityGridConfig: GridConfig) {}
}

export class ResetSettingsCompanyDetailsState {
  static readonly type = '[Settings] Reset Company Details State';
}

export class UpdateEditCompanyDetailsFormValidity {
  static readonly type =
    '[Settings] Update Edit Parent Company Details Form Validity';

  constructor(public isEditCompanyDetailsFormValid: boolean) {}
}

export class ResetCompanyLoadAndErrorState {
  static readonly type = '[Settings] Reset Company Load and Error State';
}
