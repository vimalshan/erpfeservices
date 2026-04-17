import { Injectable, Signal } from '@angular/core';
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
  CertificateDetailsModel,
  CertificateDocumentsListItemModel,
  CertificateSiteListItemModel,
  CertificationMarksListItemModel,
  DocumentMark,
} from '../../models';
import {
  ChangeCertificateDetailsLanguage,
  DownloadCertificationMark,
  LoadAllCertificationMarks,
  LoadCertificateDetails,
  LoadCertificateDocumentsList,
  LoadCertificateSitesList,
  NavigateToNewCertificate,
  ResetAllCertificationMarks,
  ResetCertificateDetailsState,
  UpdateCertificateDocumentsListGridConfig,
  UpdateCertificateSitesListGridConfig,
} from '../actions';
import { CertificateDetailsSelectors } from '../selectors';

@Injectable()
export class CertificateDetailsStoreService {
  get languageOptions(): Signal<LanguageOption[]> {
    return this.store.selectSignal(CertificateDetailsSelectors.languageOptions);
  }

  get newCertificateId(): Signal<number | null> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.newCertificateId,
    );
  }

  get documentMarks(): Signal<DocumentMark[]> {
    return this.store.selectSignal(CertificateDetailsSelectors.documentMarks);
  }

  get certificateSiteItems(): Signal<CertificateSiteListItemModel[]> {
    return this.store.selectSignal(CertificateDetailsSelectors.siteItems);
  }

  get certificateSitesTotalRecords(): Signal<number> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.siteItemsTotalFilteredRecords,
    );
  }

  get certificateSitesFilterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.siteItemsFilterOptions,
    );
  }

  get siteItemsHasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.siteItemsHasActiveFilters,
    );
  }

  get certificateDocumentsList(): Signal<CertificateDocumentsListItemModel[]> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.certificateDocumentsList,
    );
  }

  get certificateDocumentsTotalRecords(): Signal<number> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.certificateDocumentsTotalFilteredRecords,
    );
  }

  get certificateDocumentsFilterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.certificateDocumentsFilterOptions,
    );
  }

  get certificateDocumentsHasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.certificateDocumentsHasActiveFilters,
    );
  }

  get certificateDetails(): Signal<CertificateDetailsModel> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.certificateDetails,
    );
  }

  get siteScope(): Signal<string> {
    return this.store.selectSignal(CertificateDetailsSelectors.siteScope);
  }

  get isCertificateStatusIssued(): Signal<boolean> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.isCertificateStatusIssued,
    );
  }

  get hasNewRevisionNumber(): Signal<boolean> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.hasNewRevisionNumber,
    );
  }

  get allCertificationMarks(): Signal<CertificationMarksListItemModel[]> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.allCertificationMarks,
    );
  }

  get certificateDocumentsFilteringConfig(): Observable<FilteringConfig> {
    return this.store.select(
      CertificateDetailsSelectors.certificateDocumentsFilteringConfig,
    );
  }

  get siteItemsFilteringConfig(): Observable<FilteringConfig> {
    return this.store.select(
      CertificateDetailsSelectors.siteItemsFilteringConfig,
    );
  }

  get isLoadingSites(): Signal<boolean> {
    return this.store.selectSignal(CertificateDetailsSelectors.isLoadingSites);
  }

  get isLoadingDocument(): Signal<boolean> {
    return this.store.selectSignal(
      CertificateDetailsSelectors.isLoadingDocument,
    );
  }

  constructor(
    private routeStoreService: RouteStoreService,
    private store: Store,
  ) {}

  @Dispatch()
  loadCertificateDetails = () => new LoadCertificateDetails();

  @Dispatch()
  loadAllCertificationMarks = (serviceName: string, language: string) =>
    new LoadAllCertificationMarks(serviceName, language);

  @Dispatch()
  downloadCertificationMark = (downloadLink: string, fileName: string) =>
    new DownloadCertificationMark(downloadLink, fileName);

  @Dispatch()
  changeCertificateDetailsLanguage = (selectedLanguage: string) =>
    new ChangeCertificateDetailsLanguage(selectedLanguage);

  @Dispatch()
  loadSitesList = () => new LoadCertificateSitesList();

  @Dispatch()
  updateSitesListGridConfig = (gridConfig: GridConfig) =>
    new UpdateCertificateSitesListGridConfig(gridConfig);

  @Dispatch()
  loadCertificateDocumentsList = () => new LoadCertificateDocumentsList();

  @Dispatch()
  updateCertificateDocumentsListGridConfig = (gridConfig: GridConfig) =>
    new UpdateCertificateDocumentsListGridConfig(gridConfig);

  @Dispatch()
  resetCertificateDetailsState = () => new ResetCertificateDetailsState();

  @Dispatch()
  resetAllCertificationMarks = () => new ResetAllCertificationMarks();

  @Dispatch()
  navigateToNewCertificate = (newCertificateId: number | null) =>
    new NavigateToNewCertificate(newCertificateId);
}
