import { Selector } from '@ngxs/store';

import { FindingsStatusStates } from '@customer-portal/shared/constants';
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

import {
  FindingDetailsDescription,
  FindingDetailsModel,
  FindingDocumentListItemModel,
  FindingHistoryResponseModel,
  FindingResponsesModel,
} from '../../models';
import {
  FindingDetailsState,
  FindingDetailsStateModel,
} from '../finding-details.state';

export class FindingDetailsSelectors {
  @Selector([FindingDetailsSelectors._findingDetails])
  static findingDetails(
    findingDetails: FindingDetailsModel,
  ): FindingDetailsModel {
    return findingDetails;
  }

  @Selector([FindingDetailsSelectors._languageOptions])
  static languageOptions(languageOptions: LanguageOption[]): LanguageOption[] {
    return languageOptions;
  }

  @Selector([FindingDetailsSelectors._findingDetailsDescription])
  static findingDetailsDescription(
    findingDetailsDescription: FindingDetailsDescription,
  ): FindingDetailsDescription {
    return findingDetailsDescription;
  }

  @Selector([FindingDetailsSelectors._latestFindingResponses])
  static latestFindingResponses(
    latestFindingResponses: FindingResponsesModel | null,
  ) {
    return latestFindingResponses;
  }

  @Selector([FindingDetailsSelectors._isRespondInProgress])
  static isRespondInProgress(isRespondInProgress: boolean) {
    return isRespondInProgress;
  }

  @Selector([FindingDetailsSelectors._isFindingOpenOrAccepted])
  static isFindingOpenOrAccepted(isFindingOpenOrAccepted: boolean) {
    return isFindingOpenOrAccepted;
  }

  @Selector([FindingDetailsSelectors._isResponseHistoryAvailable])
  static isResponseHistoryAvailable(isResponseHistoryAvailable: boolean) {
    return isResponseHistoryAvailable;
  }

  @Selector([FindingDetailsSelectors._responseHistory])
  static responseHistory(responseHistory: FindingHistoryResponseModel[]) {
    return responseHistory;
  }

  @Selector([FindingDetailsSelectors._documentsList])
  static documentsList(
    documentsList: FindingDocumentListItemModel[],
  ): FindingDocumentListItemModel[] {
    return documentsList;
  }

  @Selector([FindingDetailsSelectors._filteringConfig])
  static filteringConfig(filteringConfig: FilteringConfig): FilteringConfig {
    return filteringConfig;
  }

  @Selector([FindingDetailsSelectors._filterOptions])
  static filterOptions(filterOptions: FilterOptions): FilterOptions {
    return filterOptions;
  }

  @Selector([FindingDetailsSelectors._documentsListTotalFilteredRecords])
  static documentsListTotalFilteredRecords(
    documentsListTotalFilteredRecords: number,
  ): number {
    return documentsListTotalFilteredRecords;
  }

  @Selector([FindingDetailsSelectors._documentsListHasActiveFilters])
  static documentsListHasActiveFilters(
    documentsListHasActiveFilters: boolean,
  ): boolean {
    return documentsListHasActiveFilters;
  }

  @Selector([FindingDetailsSelectors._auditId])
  static auditId(auditId: string): string {
    return auditId;
  }

  @Selector([FindingDetailsSelectors._isFindingResponseFormDirty])
  static isFindingResponseFormDirty(
    isFindingResponseFormDirty: boolean,
  ): boolean {
    return isFindingResponseFormDirty;
  }

  @Selector([FindingDetailsSelectors._isLoading])
  static isLoading(isLoading: boolean): boolean {
    return isLoading;
  }

  @Selector([FindingDetailsState])
  private static _findingDetails(
    state: FindingDetailsStateModel,
  ): FindingDetailsModel {
    return state.findingDetails;
  }

  @Selector([FindingDetailsState])
  private static _languageOptions(
    state: FindingDetailsStateModel,
  ): LanguageOption[] {
    const { findingDetails } = state;
    const { primaryLanguageDescription, secondaryLanguageDescription } =
      findingDetails;

    const languageOptions = [];

    if (primaryLanguageDescription.language) {
      languageOptions.push({
        language: primaryLanguageDescription.language,
        isSelected: primaryLanguageDescription.isSelected,
      });
    }

    if (secondaryLanguageDescription.language) {
      languageOptions.push({
        language: secondaryLanguageDescription.language,
        isSelected: secondaryLanguageDescription.isSelected,
      });
    }

    return languageOptions;
  }

  @Selector([FindingDetailsState])
  private static _findingDetailsDescription(
    state: FindingDetailsStateModel,
  ): FindingDetailsDescription {
    const { findingDetails } = state;

    return findingDetails?.primaryLanguageDescription.isSelected
      ? findingDetails?.primaryLanguageDescription
      : findingDetails?.secondaryLanguageDescription;
  }

  @Selector([FindingDetailsState])
  private static _latestFindingResponses(
    state: FindingDetailsStateModel,
  ): FindingResponsesModel | null {
    return state.latestFindingResponses;
  }

  @Selector([FindingDetailsState])
  private static _isRespondInProgress(
    state: FindingDetailsStateModel,
  ): boolean {
    return state.isRespondInProgress;
  }

  @Selector([FindingDetailsState])
  private static _isFindingOpenOrAccepted(
    state: FindingDetailsStateModel,
  ): boolean {
    return (
      state.findingDetails.header.status.toLowerCase() ===
        FindingsStatusStates.Open.toLowerCase() ||
      state.findingDetails.header.status.toLowerCase() ===
        FindingsStatusStates.Accepted.toLowerCase()
    );
  }

  @Selector([FindingDetailsState])
  private static _isResponseHistoryAvailable(
    state: FindingDetailsStateModel,
  ): boolean {
    return !!state.responseHistory.length;
  }

  @Selector([FindingDetailsState])
  private static _responseHistory(
    state: FindingDetailsStateModel,
  ): FindingHistoryResponseModel[] {
    return state.responseHistory;
  }

  @Selector([FindingDetailsState])
  private static _documentsList(
    state: FindingDetailsStateModel,
  ): FindingDocumentListItemModel[] {
    const { documents, gridConfig } = state;

    return applyGridConfig(documents.list, gridConfig);
  }

  @Selector([FindingDetailsState])
  private static _filteringConfig(
    state: FindingDetailsStateModel,
  ): FilteringConfig {
    return state.gridConfig.filtering;
  }

  @Selector([FindingDetailsState])
  private static _filterOptions(
    state: FindingDetailsStateModel,
  ): FilterOptions {
    return state.filterOptions;
  }

  @Selector([FindingDetailsState])
  private static _documentsListTotalFilteredRecords(
    state: FindingDetailsStateModel,
  ): number {
    const { documents, gridConfig } = state;

    return getNumberOfFilteredRecords(documents.list, gridConfig);
  }

  @Selector([FindingDetailsState])
  private static _documentsListHasActiveFilters(
    state: FindingDetailsStateModel,
  ): boolean {
    return isAnyFilterActive(state.gridConfig.filtering);
  }

  @Selector([FindingDetailsState])
  private static _auditId(state: FindingDetailsStateModel): string {
    return state.findingDetails.header.auditNumber || '';
  }

  @Selector([FindingDetailsState])
  private static _isFindingResponseFormDirty(
    state: FindingDetailsStateModel,
  ): boolean {
    return state.isFindingResponseFormDirty;
  }

  @Selector([FindingDetailsState])
  private static _isLoading(state: FindingDetailsStateModel): boolean {
    return state.documents.loading;
  }
}
