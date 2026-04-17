import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import { RouteStoreService } from '@customer-portal/router';
import {
  FilteringConfig,
  FilterOptions,
  GridConfig,
  LanguageOption,
} from '@customer-portal/shared';

import {
  FindingDetailsDescription,
  FindingDetailsModel,
  FindingDocumentListItemModel,
  FindingHistoryResponseModel,
  FindingResponsesModel,
} from '../../models';
import {
  ChangeFindingDetailsLanguage,
  LoadFindingDetails,
  LoadFindingDocumentsList,
  LoadResponseFindingsHistory,
  ResetFindingDetailsState,
  SendFindingResponsesForm,
  SetIsFindingResponseFormDirtyFlag,
  UpdateDocumentGridConfig,
} from '../actions';
import { FindingDetailsSelectors } from '../selectors';

@Injectable()
export class FindingDetailsStoreService {
  private findingId$ = this.routeStoreService.getPathParamByKey('findingId');

  get findingDetails(): Signal<FindingDetailsModel> {
    return this.store.selectSignal(FindingDetailsSelectors.findingDetails);
  }

  get languageOptions(): Signal<LanguageOption[]> {
    return this.store.selectSignal(FindingDetailsSelectors.languageOptions);
  }

  get findingDetailsDescription(): Signal<FindingDetailsDescription> {
    return this.store.selectSignal(
      FindingDetailsSelectors.findingDetailsDescription,
    );
  }

  get latestFindingResponses(): Signal<FindingResponsesModel | null> {
    return this.store.selectSignal(
      FindingDetailsSelectors.latestFindingResponses,
    );
  }

  get isRespondInProgress(): Signal<boolean> {
    return this.store.selectSignal(FindingDetailsSelectors.isRespondInProgress);
  }

  get isFindingOpenOrAccepted(): Signal<boolean> {
    return this.store.selectSignal(
      FindingDetailsSelectors.isFindingOpenOrAccepted,
    );
  }

  get responseHistory(): Signal<FindingHistoryResponseModel[]> {
    return this.store.selectSignal(FindingDetailsSelectors.responseHistory);
  }

  get documentsList(): Signal<FindingDocumentListItemModel[]> {
    return this.store.selectSignal(FindingDetailsSelectors.documentsList);
  }

  get filterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(FindingDetailsSelectors.filterOptions);
  }

  get totalRecords(): Signal<number> {
    return this.store.selectSignal(
      FindingDetailsSelectors.documentsListTotalFilteredRecords,
    );
  }

  get documentsListHasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(
      FindingDetailsSelectors.documentsListHasActiveFilters,
    );
  }

  get isResponseHistoryAvailable(): Signal<boolean> {
    return this.store.selectSignal(
      FindingDetailsSelectors.isResponseHistoryAvailable,
    );
  }

  get auditId(): Signal<string> {
    return this.store.selectSignal(FindingDetailsSelectors.auditId);
  }

  get filteringConfig(): Observable<FilteringConfig> {
    return this.store.select(FindingDetailsSelectors.filteringConfig);
  }

  get isFindingResponseFormDirty(): Observable<boolean> {
    return this.store.select(
      FindingDetailsSelectors.isFindingResponseFormDirty,
    );
  }

  findingId = toSignal(this.findingId$, { initialValue: '' });

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(FindingDetailsSelectors.isLoading);
  }

  constructor(
    private routeStoreService: RouteStoreService,
    private store: Store,
  ) {}

  @Dispatch()
  loadFindingDetails = () => new LoadFindingDetails();

  @Dispatch()
  changeFindingDetailsLanguage = (selectedLanguage: string) =>
    new ChangeFindingDetailsLanguage(selectedLanguage);

  @Dispatch()
  sendFindingResponsesForm = (submitModel: FindingResponsesModel) =>
    new SendFindingResponsesForm(submitModel);

  @Dispatch()
  loadResponseFindingsHistory = () => new LoadResponseFindingsHistory();

  @Dispatch()
  loadFindingDocumentsList = () => new LoadFindingDocumentsList();

  @Dispatch()
  updateGridConfig = (gridConfig: GridConfig) =>
    new UpdateDocumentGridConfig(gridConfig);

  @Dispatch()
  setIsFindingResponseFormDirtyFlag = (isFindingResponseFormDirty: boolean) =>
    new SetIsFindingResponseFormDirtyFlag(isFindingResponseFormDirty);

  @Dispatch()
  resetFindingDetailsState = () => new ResetFindingDetailsState();
}
