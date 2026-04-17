import { FilterValue, GridConfig } from '@customer-portal/shared';

import { CertificateListItemModel } from '../../models';

export class LoadCertificateList {
  static readonly type = '[Certificate List] Load Certificate List';
}

export class LoadCertificateListSuccess {
  static readonly type = '[Certificate List] Load Certificate List Success';

  constructor(public certificates: CertificateListItemModel[]) {}
}
export class LoadCertificateListFail {
  static readonly type = '[Certificate List] Load Certificate List Fail';
}

export class UpdateGridConfig {
  static readonly type = '[Certificate List] Update Grid Config';

  constructor(public gridConfig: GridConfig) {}
}

export class UpdateFilterOptions {
  static readonly type = '[Certificate List] Update Filter Options';
}

export class ExportCertificatesExcel {
  static readonly type = '[Certificate List] Export Certificates Excel';
}

export class ExportCertificatesExcelSuccess {
  static readonly type = '[Certificate List] Export Certificates Excel Success';

  constructor(public input: number[]) {}
}

export class ExportCertificatesExcelFail {
  static readonly type = '[Certificate List] Export Certificates Excel Fail';
}

export class ResetCertificateListState {
  static readonly type = '[Certificate List] Reset Certificate List State';
}

export class SetNavigationGridConfig {
  static readonly type = '[Certificate List] Set Navigation Grid Config';

  constructor(public chartNavigationPayload: FilterValue[]) {}
}

export class ApplyNavigationFiltersFromOverview {
  static readonly type =
    '[CertificateList] Apply Navigation Filters From Overview';
}
