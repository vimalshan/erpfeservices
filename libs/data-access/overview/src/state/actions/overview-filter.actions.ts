import {
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { OverviewFilterKey } from '../../models';

export class LoadOverviewFilterList {
  static readonly type = '[Overview Filter] Load All';
}

export class LoadOverviewFilterCompanies {
  static readonly type = '[Overview Filter] Load Companies';
}

export class LoadOverviewFilterCompaniesSuccess {
  static readonly type = '[Overview Filter] Load Companies Success';

  constructor(public dataCompanies: SharedSelectMultipleDatum<number>[]) {}
}

export class LoadOverviewFilterServices {
  static readonly type = '[Overview Filter] Load Services';
}

export class LoadOverviewFilterServicesSuccess {
  static readonly type = '[Overview Filter] Load Services Success';

  constructor(public dataServices: SharedSelectMultipleDatum<number>[]) {}
}

export class LoadOverviewFilterSites {
  static readonly type = '[Overview Filter] Load Sites';
}

export class LoadOverviewFilterSitesSuccess {
  static readonly type = '[Overview Filter] Load Sites Success';

  constructor(public dataSites: any[]) {}
}

export class UpdateOverviewFilterCompanies {
  static readonly type = '[Overview Filter] Update Companies';

  constructor(public data: number[]) {}
}

export class UpdateOverviewFilterServices {
  static readonly type = '[Overview Filter] Update Services';

  constructor(public data: number[]) {}
}

export class UpdateOverviewFilterSites {
  static readonly type = '[Overview Filter] Update Sites';

  constructor(public data: SharedSelectTreeChangeEventOutput) {}
}

export class UpdateOverviewFilterByKey {
  static readonly type = '[Overview Filter] Update by Key';

  constructor(
    public data: unknown,
    public key: OverviewFilterKey,
  ) {}
}
