import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { map, Observable } from 'rxjs';

import { RouteStoreService } from '@customer-portal/router';
import {
  FilteringConfig,
  FilterOptions,
  GridConfig,
} from '@customer-portal/shared';

import {
  AuditDetailsModel,
  AuditDocumentListItemModel,
  AuditFindingListItemModel,
  AuditSiteListItemModel,
  SubAuditListItemModel,
} from '../../models';
import {
  ExportAuditFindingsExcel,
  ExportSubAuditsExcel,
  LoadAuditDetails,
  LoadAuditDocumentsList,
  LoadAuditFindingsList,
  LoadAuditSitesList,
  LoadSubAuditList,
  ResetAuditDetailsState,
  UpdateAuditDocumentsListGridConfig,
  UpdateAuditFindingListGridConfig,
  UpdateAuditSitesListGridConfig,
  UpdateSubAuditListGridConfig,
} from '../actions';
import { AuditDetailsSelectors } from '../selectors';

@Injectable()
export class AuditDetailsStoreService {
  private auditId$ = this.routeStoreService
    .getPathParamByKey('auditId')
    .pipe(map((auditId) => String(auditId)));

  get auditDetails(): Signal<AuditDetailsModel> {
    return this.store.selectSignal(AuditDetailsSelectors.auditDetails);
  }

  get auditFindingItems(): Signal<AuditFindingListItemModel[]> {
    return this.store.selectSignal(AuditDetailsSelectors.auditFindingItems);
  }

  get auditFindingTotalFilteredRecords(): Signal<number> {
    return this.store.selectSignal(
      AuditDetailsSelectors.auditFindingTotalFilteredRecords,
    );
  }

  get auditFindingFilterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(
      AuditDetailsSelectors.auditFindingFilterOptions,
    );
  }

  get auditFindingHasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(
      AuditDetailsSelectors.auditFindingHasActiveFilters,
    );
  }

  get subAuditItems(): Signal<SubAuditListItemModel[]> {
    return this.store.selectSignal(AuditDetailsSelectors.subAuditItems);
  }

  get subAuditTotalRecords(): Signal<number> {
    return this.store.selectSignal(
      AuditDetailsSelectors.subAuditTotalFilteredRecords,
    );
  }

  get subAuditFilterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(AuditDetailsSelectors.subAuditFilterOptions);
  }

  get subAuditHasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(
      AuditDetailsSelectors.subAuditHasActiveFilters,
    );
  }

  get auditSiteItems(): Signal<AuditSiteListItemModel[]> {
    return this.store.selectSignal(AuditDetailsSelectors.siteItems);
  }

  get auditSitesTotalRecords(): Signal<number> {
    return this.store.selectSignal(
      AuditDetailsSelectors.siteItemsTotalFilteredRecords,
    );
  }

  get auditSitesFilterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(
      AuditDetailsSelectors.siteItemsFilterOptions,
    );
  }

  get siteItemsHasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(
      AuditDetailsSelectors.siteItemsHasActiveFilters,
    );
  }

  get auditDocumentsList(): Signal<AuditDocumentListItemModel[]> {
    return this.store.selectSignal(AuditDetailsSelectors.auditDocumentsList);
  }

  get auditDocumentsTotalRecords(): Signal<number> {
    return this.store.selectSignal(
      AuditDetailsSelectors.auditDocumentsTotalFilteredRecords,
    );
  }

  get auditDocumentsFilterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(
      AuditDetailsSelectors.auditDocumentsFilterOptions,
    );
  }

  get auditDocumentsHasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(
      AuditDetailsSelectors.auditDocumentsHasActiveFilters,
    );
  }

  get subAuditFilteringConfig(): Observable<FilteringConfig> {
    return this.store.select(AuditDetailsSelectors.subAuditFilteringConfig);
  }

  get subAuditFilteringConfigSignal(): Signal<FilteringConfig> {
    return this.store.selectSignal(
      AuditDetailsSelectors.subAuditFilteringConfig,
    );
  }

  get auditFindingFilteringConfig(): Observable<FilteringConfig> {
    return this.store.select(AuditDetailsSelectors.auditFindingFilteringConfig);
  }

  get auditFindingFilteringConfigSignal(): Signal<FilteringConfig> {
    return this.store.selectSignal(
      AuditDetailsSelectors.auditFindingFilteringConfig,
    );
  }

  get siteItemsFilteringConfig(): Observable<FilteringConfig> {
    return this.store.select(AuditDetailsSelectors.siteItemsFilteringConfig);
  }

  get auditDocumentsFilteringConfig(): Observable<FilteringConfig> {
    return this.store.select(
      AuditDetailsSelectors.auditDocumentsFilteringConfig,
    );
  }

  get isLoadingDocuments(): Signal<boolean> {
    return this.store.selectSignal(AuditDetailsSelectors.isLoadingDocuments);
  }

  get isLoadingSites(): Signal<boolean> {
    return this.store.selectSignal(AuditDetailsSelectors.isLoadingSites);
  }

  get isLoadingSubAudits(): Signal<boolean> {
    return this.store.selectSignal(AuditDetailsSelectors.isLoadingSubAudits);
  }

  get isLoadingFindings(): Signal<boolean> {
    return this.store.selectSignal(AuditDetailsSelectors.isLoadingFindings);
  }

  get auditDetailsLoading(): Signal<boolean> {
    return this.store.selectSignal(AuditDetailsSelectors.auditDetailsLoading);
  }

  public auditId = toSignal(this.auditId$, { initialValue: '' });

  constructor(
    private routeStoreService: RouteStoreService,
    private store: Store,
  ) {}

  @Dispatch()
  loadAuditDetails = () => new LoadAuditDetails();

  @Dispatch()
  loadAuditFindingsList = () => new LoadAuditFindingsList();

  @Dispatch()
  updateAuditFindingListGridConfig = (gridConfig: GridConfig) =>
    new UpdateAuditFindingListGridConfig(gridConfig);

  @Dispatch()
  exportAuditFindingsExcel = () => new ExportAuditFindingsExcel();

  @Dispatch()
  loadSubAuditList = () => new LoadSubAuditList();

  @Dispatch()
  updateSubAuditGridConfig = (gridConfig: GridConfig) =>
    new UpdateSubAuditListGridConfig(gridConfig);

  @Dispatch()
  exportSubAuditsExcel = () => new ExportSubAuditsExcel();

  @Dispatch()
  loadSitesList = () => new LoadAuditSitesList();

  @Dispatch()
  updateSitesListGridConfig = (gridConfig: GridConfig) =>
    new UpdateAuditSitesListGridConfig(gridConfig);

  @Dispatch()
  loadAuditDocumentsList = () => new LoadAuditDocumentsList();

  @Dispatch()
  updateAuditDocumentsListGridConfig = (gridConfig: GridConfig) =>
    new UpdateAuditDocumentsListGridConfig(gridConfig);

  @Dispatch()
  resetAuditDetailsState = () => new ResetAuditDetailsState();
}
