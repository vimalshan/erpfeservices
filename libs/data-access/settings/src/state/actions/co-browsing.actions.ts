import { CoBrowsingCompany } from '../../models';

export class UpdateIsSuaadhyaUser {
  static readonly type = '[Settings] Update Is Suaadhya User';

  constructor(public isSuaadhyaUser: boolean) {}
}

export class GetCompanyList {
  static readonly type = '[Settings] Get Company List';
}

export class GetCompanyListSuccess {
  static readonly type = '[Settings] Get Company List Success';

  constructor(public companyList: CoBrowsingCompany[]) {}
}

export class UpdateSelectedCobrowsingCompany {
  static readonly type = '[Settings] Update Selected Cobrowsing Company';

  constructor(public selectedCompany: CoBrowsingCompany) {}
}

export class ResetSelectedCobrowsingCompany {
  static readonly type = '[Settings] Reset Selected Cobrowsing Company';
}

export class UpdateImpersonatedUser {
  static readonly type = '[Settings] Update Impersonated User';

  constructor(public impersonatedUserEmail: string | null) {}
}
