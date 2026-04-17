import { Selector } from '@ngxs/store';

import {
  applyGridConfig,
  getNumberOfFilteredRecords,
  isAnyFilterActive,
} from '@customer-portal/shared/helpers/grid';
import {
  FilteringConfig,
  FilterOptions,
} from '@customer-portal/shared/models/grid';

import {
  AuditDetailsModel,
  AuditDocumentListItemModel,
  AuditFindingListItemModel,
  AuditSiteListItemModel,
  SubAuditListItemModel,
} from '../../models';
import {
  AuditDetailsState,
  AuditDetailsStateModel,
} from '../audit-details.state';

export class AuditDetailsSelectors {
  @Selector([AuditDetailsSelectors._auditDetails])
  static auditDetails(auditDetails: AuditDetailsModel): AuditDetailsModel {
    return auditDetails;
  }

  @Selector([AuditDetailsSelectors._auditFindingItems])
  static auditFindingItems(
    auditFindingItems: AuditFindingListItemModel[],
  ): AuditFindingListItemModel[] {
    return auditFindingItems;
  }

  @Selector([AuditDetailsSelectors._auditFindingTotalFilteredRecords])
  static auditFindingTotalFilteredRecords(
    auditFindingTotalFilteredRecords: number,
  ): number {
    return auditFindingTotalFilteredRecords;
  }

  @Selector([AuditDetailsSelectors._auditFindingFilterOptions])
  static auditFindingFilterOptions(
    auditFindingFilterOptions: FilterOptions,
  ): FilterOptions {
    return auditFindingFilterOptions;
  }

  @Selector([AuditDetailsSelectors._auditFindingFilteringConfig])
  static auditFindingFilteringConfig(
    auditFindingFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return auditFindingFilteringConfig;
  }

  @Selector([AuditDetailsSelectors._auditFindingHasActiveFilters])
  static auditFindingHasActiveFilters(
    auditFindingHasActiveFilters: boolean,
  ): boolean {
    return auditFindingHasActiveFilters;
  }

  @Selector([AuditDetailsSelectors._subAuditItems])
  static subAuditItems(
    subAuditItems: SubAuditListItemModel[],
  ): SubAuditListItemModel[] {
    return subAuditItems;
  }

  @Selector([AuditDetailsSelectors._subAuditTotalFilteredRecords])
  static subAuditTotalFilteredRecords(
    subAuditTotalFilteredRecords: number,
  ): number {
    return subAuditTotalFilteredRecords;
  }

  @Selector([AuditDetailsSelectors._subAuditFilterOptions])
  static subAuditFilterOptions(
    subAuditFilterOptions: FilterOptions,
  ): FilterOptions {
    return subAuditFilterOptions;
  }

  @Selector([AuditDetailsSelectors._subAuditFilteringConfig])
  static subAuditFilteringConfig(
    subAuditFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return subAuditFilteringConfig;
  }

  @Selector([AuditDetailsSelectors._subAuditHasActiveFilters])
  static subAuditHasActiveFilters(subAuditHasActiveFilters: boolean): boolean {
    return subAuditHasActiveFilters;
  }

  @Selector([AuditDetailsSelectors._siteItems])
  static siteItems(
    siteItems: AuditSiteListItemModel[],
  ): AuditSiteListItemModel[] {
    return siteItems;
  }

  @Selector([AuditDetailsSelectors._siteItemsTotalFilteredRecords])
  static siteItemsTotalFilteredRecords(
    siteItemsTotalFilteredRecords: number,
  ): number {
    return siteItemsTotalFilteredRecords;
  }

  @Selector([AuditDetailsSelectors._siteItemsFilterOptions])
  static siteItemsFilterOptions(
    siteItemsFilterOptions: FilterOptions,
  ): FilterOptions {
    return siteItemsFilterOptions;
  }

  @Selector([AuditDetailsSelectors._siteItemsFilteringConfig])
  static siteItemsFilteringConfig(
    siteItemsFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return siteItemsFilteringConfig;
  }

  @Selector([AuditDetailsSelectors._siteItemsHasActiveFilters])
  static siteItemsHasActiveFilters(
    siteItemsHasActiveFilters: boolean,
  ): boolean {
    return siteItemsHasActiveFilters;
  }

  @Selector([AuditDetailsSelectors._auditDocumentsList])
  static auditDocumentsList(
    auditDocumentsList: AuditDocumentListItemModel[],
  ): AuditDocumentListItemModel[] {
    return auditDocumentsList;
  }

  @Selector([AuditDetailsSelectors._auditDocumentsTotalFilteredRecords])
  static auditDocumentsTotalFilteredRecords(
    auditDocumentsTotalFilteredRecords: number,
  ): number {
    return auditDocumentsTotalFilteredRecords;
  }

  @Selector([AuditDetailsSelectors._auditDocumentsFilterOptions])
  static auditDocumentsFilterOptions(
    auditDocumentsFilterOptions: FilterOptions,
  ): FilterOptions {
    return auditDocumentsFilterOptions;
  }

  @Selector([AuditDetailsSelectors._auditDocumentsFilteringConfig])
  static auditDocumentsFilteringConfig(
    auditDocumentsFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return auditDocumentsFilteringConfig;
  }

  @Selector([AuditDetailsSelectors._auditDocumentsHasActiveFilters])
  static auditDocumentsHasActiveFilters(
    auditDocumentsHasActiveFilters: boolean,
  ): boolean {
    return auditDocumentsHasActiveFilters;
  }

  @Selector([AuditDetailsSelectors._isLoadingFindings])
  static isLoadingFindings(isLoadingFindings: boolean): boolean {
    return isLoadingFindings;
  }

  @Selector([AuditDetailsSelectors._isLoadingDocuments])
  static isLoadingDocuments(isLoadingDocuments: boolean): boolean {
    return isLoadingDocuments;
  }

  @Selector([AuditDetailsSelectors._isLoadingSubAudits])
  static isLoadingSubAudits(isLoadingSubAudits: boolean): boolean {
    return isLoadingSubAudits;
  }

  @Selector([AuditDetailsSelectors._isLoadingSites])
  static isLoadingSites(isLoadingSites: boolean): boolean {
    return isLoadingSites;
  }

  @Selector([AuditDetailsSelectors._auditDetailsLoading])
  static auditDetailsLoading(auditDetailsLoading: boolean): boolean {
    return auditDetailsLoading;
  }

  @Selector([AuditDetailsState])
  private static _auditDetailsLoading(state: AuditDetailsStateModel): boolean {
    return state.loading;
  }

  @Selector([AuditDetailsState])
  private static _auditDetails(
    state: AuditDetailsStateModel,
  ): AuditDetailsModel {
    return state.auditDetails;
  }

  @Selector([AuditDetailsState])
  private static _auditFindingItems(
    state: AuditDetailsStateModel,
  ): AuditFindingListItemModel[] {
    const { findings, auditFindingGridConfig } = state;

    return applyGridConfig(findings.list, auditFindingGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _auditFindingTotalFilteredRecords(
    state: AuditDetailsStateModel,
  ): number {
    const { findings, auditFindingGridConfig } = state;

    return getNumberOfFilteredRecords(findings.list, auditFindingGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _auditFindingFilterOptions(
    state: AuditDetailsStateModel,
  ): FilterOptions {
    return state.auditFindingFilterOptions;
  }

  @Selector([AuditDetailsState])
  private static _auditFindingFilteringConfig(
    state: AuditDetailsStateModel,
  ): FilteringConfig {
    return state.auditFindingGridConfig.filtering;
  }

  @Selector([AuditDetailsState])
  private static _auditFindingHasActiveFilters(
    state: AuditDetailsStateModel,
  ): boolean {
    return isAnyFilterActive(state.auditFindingGridConfig.filtering);
  }

  @Selector([AuditDetailsState])
  private static _subAuditItems(
    state: AuditDetailsStateModel,
  ): SubAuditListItemModel[] {
    const { subaudit, subAuditGridConfig } = state;

    return applyGridConfig(subaudit.list, subAuditGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _subAuditTotalFilteredRecords(
    state: AuditDetailsStateModel,
  ): number {
    const { subaudit, subAuditGridConfig } = state;

    return getNumberOfFilteredRecords(subaudit.list, subAuditGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _subAuditFilterOptions(
    state: AuditDetailsStateModel,
  ): FilterOptions {
    return state.subAuditFilterOptions;
  }

  @Selector([AuditDetailsState])
  private static _subAuditFilteringConfig(
    state: AuditDetailsStateModel,
  ): FilteringConfig {
    return state.subAuditGridConfig.filtering;
  }

  @Selector([AuditDetailsState])
  private static _subAuditHasActiveFilters(
    state: AuditDetailsStateModel,
  ): boolean {
    return isAnyFilterActive(state.subAuditGridConfig.filtering);
  }

  @Selector([AuditDetailsState])
  private static _siteItems(
    state: AuditDetailsStateModel,
  ): AuditSiteListItemModel[] {
    const { sites, siteItemsGridConfig } = state;

    return applyGridConfig(sites.list, siteItemsGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _siteItemsTotalFilteredRecords(
    state: AuditDetailsStateModel,
  ): number {
    const { sites, siteItemsGridConfig } = state;

    return getNumberOfFilteredRecords(sites.list, siteItemsGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _siteItemsFilterOptions(
    state: AuditDetailsStateModel,
  ): FilterOptions {
    return state.siteItemsFilterOptions;
  }

  @Selector([AuditDetailsState])
  private static _siteItemsFilteringConfig(
    state: AuditDetailsStateModel,
  ): FilteringConfig {
    return state.siteItemsGridConfig.filtering;
  }

  @Selector([AuditDetailsState])
  private static _siteItemsHasActiveFilters(
    state: AuditDetailsStateModel,
  ): boolean {
    return isAnyFilterActive(state.siteItemsGridConfig.filtering);
  }

  @Selector([AuditDetailsState])
  private static _auditDocumentsList(
    state: AuditDetailsStateModel,
  ): AuditDocumentListItemModel[] {
    const { documents, auditDocumentsGridConfig } = state;

    return applyGridConfig(documents.list, auditDocumentsGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _auditDocumentsTotalFilteredRecords(
    state: AuditDetailsStateModel,
  ): number {
    const { documents, auditDocumentsGridConfig } = state;

    return getNumberOfFilteredRecords(documents.list, auditDocumentsGridConfig);
  }

  @Selector([AuditDetailsState])
  private static _auditDocumentsFilterOptions(
    state: AuditDetailsStateModel,
  ): FilterOptions {
    return state.auditDocumentsFilterOptions;
  }

  @Selector([AuditDetailsState])
  private static _auditDocumentsFilteringConfig(
    state: AuditDetailsStateModel,
  ): FilteringConfig {
    return state.auditDocumentsGridConfig.filtering;
  }

  @Selector([AuditDetailsState])
  private static _auditDocumentsHasActiveFilters(
    state: AuditDetailsStateModel,
  ): boolean {
    return isAnyFilterActive(state.auditDocumentsGridConfig.filtering);
  }

  @Selector([AuditDetailsState])
  private static _isLoadingFindings(state: AuditDetailsStateModel): boolean {
    return state.findings.loading;
  }

  @Selector([AuditDetailsState])
  private static _isLoadingDocuments(state: AuditDetailsStateModel): boolean {
    return state.documents.loading;
  }

  @Selector([AuditDetailsState])
  private static _isLoadingSubAudits(state: AuditDetailsStateModel): boolean {
    return state.subaudit.loading;
  }

  @Selector([AuditDetailsState])
  private static _isLoadingSites(state: AuditDetailsStateModel): boolean {
    return state.sites.loading;
  }
}
