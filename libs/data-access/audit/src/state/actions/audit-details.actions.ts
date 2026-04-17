import { GridConfig } from '@customer-portal/shared';

import {
  AuditDetailsModel,
  AuditDocumentListItemModel,
  AuditFindingListItemModel,
  AuditSiteListItemModel,
  SubAuditListItemModel,
} from '../../models';

// #region AuditDetails
export class LoadAuditDetails {
  static readonly type = '[Audit Details] Load Audit Details';
}

export class LoadAuditDetailsSuccess {
  static readonly type = '[Audit Details] Load Audit Details Success';

  constructor(
    public auditDetails: AuditDetailsModel,
    public auditId: string,
  ) {}
}
// #endregion AuditDetails

// #region AuditFindingsList
export class LoadAuditFindingsList {
  static readonly type = '[Audit Details] Load Audit Findings List Items';
}

export class LoadAuditFindingsListSuccess {
  static readonly type =
    '[Audit Details] Load Audit Findings List Items Success';

  constructor(public auditFindingItems: AuditFindingListItemModel[]) {}
}
export class LoadAuditFindingsListFail {
  static readonly type = '[Audit Details] Load Findings List Fail';
}
export class UpdateAuditFindingListGridConfig {
  static readonly type =
    '[Audit Details] Update Audit Finding List Grid Config';

  constructor(public auditFindingGridConfig: GridConfig) {}
}

export class UpdateAuditFindingListFilterOptions {
  static readonly type =
    '[Audit Details] Update Audit Finding List Filter Options';

  constructor(public auditFindingItems: AuditFindingListItemModel[]) {}
}

export class ExportAuditFindingsExcel {
  static readonly type = '[Audit Details] Export Audit Findings Audits Excel';
}

export class ResetAuditDetailsState {
  static readonly type = '[Audit Details] Reset Audit Details State';
}
// #endregion AuditFindingsList

// #region SubAuditList

export class LoadSubAuditList {
  static readonly type = '[Audit Details] Load Sub Audit List Items';
}

export class LoadSubAuditListSuccess {
  static readonly type = '[Audit Details] Load Audit List Items Success';

  constructor(public subAuditItems: SubAuditListItemModel[]) {}
}
export class LoadSubAuditListFail {
  static readonly type = '[Audit Details] Load Audit List Fail';
}
export class UpdateSubAuditListGridConfig {
  static readonly type = '[Audit Details] Update SubAudit Grid Config';

  constructor(public subAuditGridConfig: GridConfig) {}
}

export class UpdateSubAuditListFilterOptions {
  static readonly type = '[Audit Details] Update SubAudit Filters Config';

  constructor(public subAuditItems: SubAuditListItemModel[]) {}
}

export class ExportSubAuditsExcel {
  static readonly type = '[Audit Details] Export SubAudits Audits Excel';
}

export class ExportSubAuditExcelSuccess {
  static readonly type = '[AuditDetails] Export Sub Audit Excel Success';

  constructor(public input: number[]) {}
}

// #endregion SubAuditList

// #region AuditSitesList

export class LoadAuditSitesList {
  static readonly type = '[Audit Details] Load Audit Sites List Items';
}

export class LoadAuditSitesListSuccess {
  static readonly type = '[Audit Details] Load Audit Sites List Items Success';

  constructor(public auditSiteItems: AuditSiteListItemModel[]) {}
}
export class LoadAuditSitesListFail {
  static readonly type = '[Audit Details] Load Audit Sites List Fail';
}
export class UpdateAuditSitesListGridConfig {
  static readonly type = '[Audit Details] Update Audit Sites Grid Config';

  constructor(public auditSiteItemsGridConfig: GridConfig) {}
}

export class UpdateAuditSitesListFilterOptions {
  static readonly type = '[Audit Details] Update Audit Sites Filters Config';

  constructor(public auditSiteItems: AuditSiteListItemModel[]) {}
}

// #endregion AuditSitesList

// #region AuditDocumentsList

export class LoadAuditDocumentsList {
  static readonly type = '[Audit Details] Load Audit Documents List Items';
}

export class LoadAuditDocumentsListSuccess {
  static readonly type =
    '[Audit Details] Load Audit Documents List Items Success';

  constructor(public auditDocumentsList: AuditDocumentListItemModel[]) {}
}
export class LoadAuditDocumentsListFail {
  static readonly type = '[Audit Details] Load Audit Documents List Fail';
}
export class UpdateAuditDocumentsListGridConfig {
  static readonly type = '[Audit Details] Update Audit Documents Grid Config';

  constructor(public auditDocumentsGridConfig: GridConfig) {}
}

export class LoadAuditHeaderDocDetails {
  static readonly type = '[AuditDetails] Load Audit Header Docs';

  constructor(public auditId: string) {}
}

export class UpdateAuditDocumentsListFilterOptions {
  static readonly type =
    '[Audit Details] Update Audit Documents Filters Config';

  constructor(public auditDocumentsList: AuditDocumentListItemModel[]) {}
}

// #endregion AuditDocumentsList
