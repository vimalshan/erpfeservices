import {
  FilterValue,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { CertificateChartFilterKey } from '../../constants';
import { CertificatesTabs } from '../../models';

export class SetActiveCertificatesListGraphTab {
  static readonly type =
    '[Certificate List Graphs] Set Active Certificates Tab';

  constructor(public activeTab: CertificatesTabs) {}
}

export class LoadCertificateListAndGraphFilters {
  static readonly type = '[Certificate List Graph] Load List and Graph Filters';
}

export class UpdateCertificateListGraphFilterByKey {
  static readonly type = '[Certificate List Graph] Update Filter';

  constructor(
    public data: unknown,
    public key: CertificateChartFilterKey,
  ) {}
}

export class UpdateCertificateListGraphFilterCompanies {
  static readonly type = '[Certificate List Graph] Update Selected Companies';

  constructor(public data: number[]) {}
}

export class UpdateCertificateListGraphFilterServices {
  static readonly type = '[Certificate List Graph] Update Selected Services';

  constructor(public data: number[]) {}
}

export class UpdateCertificateListGraphFilterSites {
  static readonly type = '[Certificate List Graph]  Update Selected Sites';

  constructor(public data: SharedSelectTreeChangeEventOutput) {}
}

export class UpdateCertificateListGraphFilteredDateRange {
  static readonly type = '[Certificate List Graph] Update Selected Date Range';

  constructor(public data: Date[]) {}
}

export class ResetCertificateListGraphFiltersExceptDateToCurrentYear {
  static readonly type =
    '[Certificate List Graph] Reset All Filters Except Date To Current Year';
}

export class ResetCertificateListGraphState {
  static readonly type =
    '[Certificate List Graph] Reset Certificate List Graph State';
}

// #region CertificatesGraphsData
export class LoadCertificateListGraphData {
  static readonly type =
    '[Certificate List Graph] Load Certificates Graphs Data';
}

export class ResetCertificateListGraphData {
  static readonly type =
    '[Certificate List Graph] Reset Certificates Graphs Data';
}
// #endregion CertificateListGraphData

// #region CertificateGraphs
export class LoadCertificatesByStatusListGraphData {
  static readonly type =
    '[Certificate List Graph] Load Certificates By Status Graph Data';
}

export class LoadCertificatesByTypeListGraphData {
  static readonly type =
    '[Certificate List Graph] Load Certificates By Type Graph Data';
}

export class ResetCertificatesByStatusListGraphData {
  static readonly type =
    '[Certificate List Graph] Reset Certificates By Status Graph Data';
}

export class ResetCertificatesByTypeListGraphData {
  static readonly type =
    '[Certificate List Graph] Reset Certificates By Type Graph Data';
}

export class ResetCertificateListGraphsState {
  static readonly type =
    '[Certificate List Graph] Reset Certificate List Graph State';
}

// #endregion CertificateGraphs

// #region CertificatesBySite
export class LoadCertificatesBySiteListData {
  static readonly type =
    '[Certificate List Graph] Load Certificates By Site Data';
}

export class ResetCertificatesBySiteListData {
  static readonly type =
    '[Certificate List Graph] Reset Certificates By Site Data';
}

export class NavigateFromListChartToListView {
  static readonly type =
    '[Certificate List Graphs] Navigate From List Chart To List View';

  constructor(public tooltipFilters: FilterValue[]) {}
}
