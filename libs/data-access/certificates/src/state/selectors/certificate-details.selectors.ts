import { Selector } from '@ngxs/store';

import {
  applyGridConfig,
  getNumberOfFilteredRecords,
  isAnyFilterActive,
} from '@customer-portal/shared/helpers/grid';
import {
  FilteringConfig,
  FilterOptions,
  LanguageOption,
} from '@customer-portal/shared/models';

import { CertificateStatus } from '../../constants';
import {
  CertificateDetailsModel,
  CertificateDocumentsListItemModel,
  CertificateSiteListItemModel,
  CertificationMarksListItemModel,
  DocumentMark,
} from '../../models';
import {
  CertificateDetailsState,
  CertificateDetailsStateModel,
} from '../certificate-details.state';

export class CertificateDetailsSelectors {
  @Selector([CertificateDetailsSelectors._certificateDetails])
  static certificateDetails(
    certificateDetails: CertificateDetailsModel,
  ): CertificateDetailsModel {
    return certificateDetails;
  }

  @Selector([CertificateDetailsSelectors._allCertificationMarks])
  static allCertificationMarks(
    allCertificationMarks: CertificationMarksListItemModel[],
  ): CertificationMarksListItemModel[] {
    return allCertificationMarks;
  }

  @Selector([CertificateDetailsSelectors._languageOptions])
  static languageOptions(languageOptions: LanguageOption[]): LanguageOption[] {
    return languageOptions;
  }

  @Selector([CertificateDetailsSelectors._newCertificateId])
  static newCertificateId(newCertificateId: number | null): number | null {
    return newCertificateId;
  }

  @Selector([CertificateDetailsSelectors._documentMarks])
  static documentMarks(documentMarks: DocumentMark[]): DocumentMark[] {
    return documentMarks;
  }

  @Selector([CertificateDetailsSelectors._siteScope])
  static siteScope(siteScope: string): string {
    return siteScope;
  }

  @Selector([CertificateDetailsSelectors._isCertificateStatusIssued])
  static isCertificateStatusIssued(
    isCertificateStatusIssued: boolean,
  ): boolean {
    return isCertificateStatusIssued;
  }

  @Selector([CertificateDetailsSelectors._hasNewRevisionNumber])
  static hasNewRevisionNumber(hasNewRevisionNumber: boolean): boolean {
    return hasNewRevisionNumber;
  }

  @Selector([CertificateDetailsSelectors._siteItems])
  static siteItems(
    siteItems: CertificateSiteListItemModel[],
  ): CertificateSiteListItemModel[] {
    return siteItems;
  }

  @Selector([CertificateDetailsSelectors._siteItemsTotalFilteredRecords])
  static siteItemsTotalFilteredRecords(
    siteItemsTotalFilteredRecords: number,
  ): number {
    return siteItemsTotalFilteredRecords;
  }

  @Selector([CertificateDetailsSelectors._siteItemsFilterOptions])
  static siteItemsFilterOptions(
    siteItemsFilterOptions: FilterOptions,
  ): FilterOptions {
    return siteItemsFilterOptions;
  }

  @Selector([CertificateDetailsSelectors._siteItemsFilteringConfig])
  static siteItemsFilteringConfig(
    siteItemsFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return siteItemsFilteringConfig;
  }

  @Selector([CertificateDetailsSelectors._siteItemsHasActiveFilters])
  static siteItemsHasActiveFilters(
    siteItemsHasActiveFilters: boolean,
  ): boolean {
    return siteItemsHasActiveFilters;
  }

  @Selector([CertificateDetailsSelectors._certificateDocumentsList])
  static certificateDocumentsList(
    certificateDocumentsList: CertificateDocumentsListItemModel[],
  ): CertificateDocumentsListItemModel[] {
    return certificateDocumentsList;
  }

  @Selector([
    CertificateDetailsSelectors._certificateDocumentsTotalFilteredRecords,
  ])
  static certificateDocumentsTotalFilteredRecords(
    certificateDocumentsTotalFilteredRecords: number,
  ): number {
    return certificateDocumentsTotalFilteredRecords;
  }

  @Selector([CertificateDetailsSelectors._certificateDocumentsFilterOptions])
  static certificateDocumentsFilterOptions(
    certificateDocumentsFilterOptions: FilterOptions,
  ): FilterOptions {
    return certificateDocumentsFilterOptions;
  }

  @Selector([CertificateDetailsSelectors._certificateDocumentsFilteringConfig])
  static certificateDocumentsFilteringConfig(
    certificateDocumentsFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return certificateDocumentsFilteringConfig;
  }

  @Selector([CertificateDetailsSelectors._certificateDocumentsHasActiveFilters])
  static certificateDocumentsHasActiveFilters(
    certificateDocumentsHasActiveFilters: boolean,
  ): boolean {
    return certificateDocumentsHasActiveFilters;
  }

  @Selector([CertificateDetailsSelectors._isLoadingSites])
  static isLoadingSites(isLoadingSites: boolean): boolean {
    return isLoadingSites;
  }

  @Selector([CertificateDetailsSelectors._isLoadingDocuments])
  static isLoadingDocument(isLoadingDocument: boolean): boolean {
    return isLoadingDocument;
  }

  @Selector([CertificateDetailsState])
  private static _certificateDetails(
    state: CertificateDetailsStateModel,
  ): CertificateDetailsModel {
    return state.certificateDetails;
  }

  @Selector([CertificateDetailsState])
  private static _allCertificationMarks(
    state: CertificateDetailsStateModel,
  ): CertificationMarksListItemModel[] {
    return state.allCertificationMarks;
  }

  @Selector([CertificateDetailsState])
  private static _languageOptions(
    state: CertificateDetailsStateModel,
  ): LanguageOption[] {
    const { certificateDetails } = state;
    const { languages } = certificateDetails.header;

    return languages.map((language) => ({
      isSelected: language.isSelected,
      language: language.name,
      code: language.code,
    }));
  }

  @Selector([CertificateDetailsState])
  private static _newCertificateId(
    state: CertificateDetailsStateModel,
  ): number | null {
    return state.certificateDetails.newCertificateId;
  }

  @Selector([CertificateDetailsState])
  private static _documentMarks(
    state: CertificateDetailsStateModel,
  ): DocumentMark[] {
    return state.certificateDetails.header.documentMarks;
  }

  @Selector([CertificateDetailsState])
  private static _siteScope(state: CertificateDetailsStateModel): string {
    const { certificateDetails } = state;
    const { scopes, languages } = certificateDetails.header;
    const selectedLanguageCode = languages.find((l) => l.isSelected)?.code;

    return (
      scopes.find((scope) => scope.language === selectedLanguageCode)
        ?.content || ''
    );
  }

  @Selector([CertificateDetailsState])
  private static _isCertificateStatusIssued(
    state: CertificateDetailsStateModel,
  ): boolean {
    return state.certificateDetails.header.status === CertificateStatus.Issued;
  }

  @Selector([CertificateDetailsState])
  private static _hasNewRevisionNumber(
    state: CertificateDetailsStateModel,
  ): boolean {
    return Number.isInteger(state.certificateDetails.newCertificateId);
  }

  @Selector([CertificateDetailsState])
  private static _siteItems(
    state: CertificateDetailsStateModel,
  ): CertificateSiteListItemModel[] {
    return applyGridConfig(state.sites.list, state.siteItemsGridConfig);
  }

  @Selector([CertificateDetailsState])
  private static _siteItemsTotalFilteredRecords(
    state: CertificateDetailsStateModel,
  ): number {
    return getNumberOfFilteredRecords(
      state.sites.list,
      state.siteItemsGridConfig,
    );
  }

  @Selector([CertificateDetailsState])
  private static _siteItemsFilterOptions(
    state: CertificateDetailsStateModel,
  ): FilterOptions {
    return state.siteItemsFilterOptions;
  }

  @Selector([CertificateDetailsState])
  private static _siteItemsFilteringConfig(
    state: CertificateDetailsStateModel,
  ): FilteringConfig {
    return state.siteItemsGridConfig.filtering;
  }

  @Selector([CertificateDetailsState])
  private static _siteItemsHasActiveFilters(
    state: CertificateDetailsStateModel,
  ): boolean {
    return isAnyFilterActive(state.siteItemsGridConfig.filtering);
  }

  @Selector([CertificateDetailsState])
  private static _certificateDocumentsList(
    state: CertificateDetailsStateModel,
  ): CertificateDocumentsListItemModel[] {
    return applyGridConfig(
      state.documents.list,
      state.certificateDocumentsGridConfig,
    );
  }

  @Selector([CertificateDetailsState])
  private static _certificateDocumentsTotalFilteredRecords(
    state: CertificateDetailsStateModel,
  ): number {
    return getNumberOfFilteredRecords(
      state.documents.list,
      state.certificateDocumentsGridConfig,
    );
  }

  @Selector([CertificateDetailsState])
  private static _certificateDocumentsFilterOptions(
    state: CertificateDetailsStateModel,
  ): FilterOptions {
    return state.certificateDocumentsFilterOptions;
  }

  @Selector([CertificateDetailsState])
  private static _certificateDocumentsFilteringConfig(
    state: CertificateDetailsStateModel,
  ): FilteringConfig {
    return state.certificateDocumentsGridConfig.filtering;
  }

  @Selector([CertificateDetailsState])
  private static _certificateDocumentsHasActiveFilters(
    state: CertificateDetailsStateModel,
  ): boolean {
    return isAnyFilterActive(state.certificateDocumentsGridConfig.filtering);
  }

  @Selector([CertificateDetailsState])
  private static _isLoadingSites(state: CertificateDetailsStateModel): boolean {
    return state.sites.loading;
  }

  @Selector([CertificateDetailsState])
  private static _isLoadingDocuments(
    state: CertificateDetailsStateModel,
  ): boolean {
    return state.documents.loading;
  }
}
