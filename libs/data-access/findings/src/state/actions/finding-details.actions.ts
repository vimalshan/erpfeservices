import { GridConfig } from '@customer-portal/shared';

import {
  FindingDetailsModel,
  FindingDocumentListItemModel,
  FindingHistoryResponseModel,
  FindingResponsesModel,
} from '../../models';

export class LoadFindingDetails {
  static readonly type = '[Finding Details] Load Finding Details';
}

export class LoadFindingDetailsSuccess {
  static readonly type = '[Finding Details] Load Finding Details Success';

  constructor(public findingDetails: FindingDetailsModel) {}
}

export class ChangeFindingDetailsLanguage {
  static readonly type = '[Finding Details] Change Selected Language';

  constructor(public selectedLanguage: string) {}
}

export class SendFindingResponsesForm {
  static readonly type = '[Finding Details] Send Finding Responses Form';

  constructor(public submitModel: FindingResponsesModel) {}
}

export class SendFindingResponsesFormSuccess {
  static readonly type =
    '[Finding Details] Send Finding Responses Form Success';

  constructor(public isSubmitToDnv: boolean) {}
}

export class LoadLatestFindingResponses {
  static readonly type = '[Finding Details] Load Latest Finding Responses';
}

export class LoadLatestFindingResponsesSuccess {
  static readonly type =
    '[Finding Details] Load Latest Finding Responses Success';

  constructor(public latestFindingResponses: FindingResponsesModel | null) {}
}

export class SwitchIsRespondInProgress {
  static readonly type = '[Finding Details] Switch Is Respond In Progress Flag';

  constructor(public isRespondInProgress: boolean) {}
}

export class LoadResponseFindingsHistory {
  static readonly type = '[Finding Details] Load Response Findings History';
}

export class LoadResponseFindingsHistorySuccess {
  static readonly type =
    '[Finding Details] Load Response Findings History Success';

  constructor(public responseHistory: FindingHistoryResponseModel[]) {}
}

export class LoadFindingDocumentsList {
  static readonly type = '[Finding Details] Load Finding Document List';
}

export class LoadFindingDocumentsListSuccess {
  static readonly type = '[Finding Details] Load Finding Document List Success';

  constructor(public documentsList: FindingDocumentListItemModel[]) {}
}
export class LoadFindingDocumentsListFail {
  static readonly type = '[Finding Details] Load Finding Document List failed';
}
export class UpdateDocumentGridConfig {
  static readonly type = '[Finding Details] Update Document Grid Config';

  constructor(public gridConfig: GridConfig) {}
}

export class UpdateDocumentFilterOptions {
  static readonly type = '[Finding Details] Update Document Filter Options';

  constructor(public documentsList: FindingDocumentListItemModel[]) {}
}

export class SetIsFindingResponseFormDirtyFlag {
  static readonly type =
    '[Finding Details] Set Is Finding Response Form Dirty Flag';

  constructor(public isFindingResponseFormDirty: boolean) {}
}

export class ResetFindingDetailsState {
  static readonly type = '[Finding Details] Reset Finding Details State';
}
