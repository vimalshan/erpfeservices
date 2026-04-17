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
  SettingsCompanyDetailsCountryListData,
  SettingsCompanyDetailsData,
} from '../../models';
import { SettingsState, SettingsStateModel } from '../settings.state';

export class SettingsSelectors {
  @Selector([SettingsSelectors._isUserAdmin])
  static isUserAdmin(isUserAdmin: boolean): boolean {
    return isUserAdmin;
  }

  @Selector([SettingsSelectors._updatePendingParentCompany])
  static updatePendingParentCompany(updatePending: boolean): boolean {
    return updatePending;
  }

  @Selector([SettingsSelectors._legalEntityList])
  static legalEntityList(
    legalEntityList: SettingsCompanyDetailsData[],
  ): SettingsCompanyDetailsData[] {
    return legalEntityList;
  }

  @Selector([SettingsSelectors._totalLegalEntityList])
  static totalLegalEntityList(totalLegalEntityList: number): number {
    return totalLegalEntityList;
  }

  @Selector([SettingsSelectors._parentCompany])
  static parentCompany(
    parentCompany: SettingsCompanyDetailsData | null,
  ): SettingsCompanyDetailsData | null {
    return parentCompany;
  }

  @Selector([SettingsSelectors._legalEntityFilterOptions])
  static legalEntityFilterOptions(
    legalEntityFilterOptions: FilterOptions,
  ): FilterOptions {
    return legalEntityFilterOptions;
  }

  @Selector([SettingsSelectors._legalEntityFilteringConfig])
  static legalEntityFilteringConfig(
    legalEntityFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return legalEntityFilteringConfig;
  }

  @Selector([SettingsSelectors._hasLegalEntityActiveFilters])
  static hasLegalEntityActiveFilters(
    hasLegalEntityActiveFilters: boolean,
  ): boolean {
    return hasLegalEntityActiveFilters;
  }

  @Selector([SettingsSelectors._legalEntityListCounter])
  static legalEntityListCounter(legalEntityListCounter: number): number {
    return legalEntityListCounter;
  }

  @Selector([SettingsSelectors._countryList])
  static countryList(
    countryList: SettingsCompanyDetailsCountryListData[],
  ): SettingsCompanyDetailsCountryListData[] {
    return countryList;
  }

  @Selector([SettingsSelectors._countryActiveId])
  static countryActiveId(countryActiveId: number | null): number | null {
    return countryActiveId;
  }

  @Selector([SettingsSelectors._isEditCompanyDetailsFormValid])
  static isEditCompanyDetailsFormValid(
    isEditCompanyDetailsFormValid: boolean,
  ): boolean {
    return isEditCompanyDetailsFormValid;
  }

  @Selector([SettingsState])
  private static _isUserAdmin(state: SettingsStateModel): boolean {
    return state.isUserAdmin;
  }

  @Selector([SettingsState])
  private static _updatePendingParentCompany(
    state: SettingsStateModel,
  ): boolean {
    return !!state?.parentCompany?.updatePending;
  }

  @Selector([SettingsState])
  private static _legalEntityList(
    state: SettingsStateModel,
  ): SettingsCompanyDetailsData[] {
    const { legalEntityList, legalEntityGridConfig } = state;

    return applyGridConfig(legalEntityList, legalEntityGridConfig);
  }

  @Selector([SettingsState])
  private static _totalLegalEntityList(state: SettingsStateModel): number {
    const { legalEntityList, legalEntityGridConfig } = state;

    return getNumberOfFilteredRecords(legalEntityList, legalEntityGridConfig);
  }

  @Selector([SettingsState])
  private static _parentCompany(
    state: SettingsStateModel,
  ): SettingsCompanyDetailsData | null {
    return state?.parentCompany;
  }

  @Selector([SettingsState])
  private static _legalEntityFilterOptions(
    state: SettingsStateModel,
  ): FilterOptions {
    return state.legalEntityFilterOptions;
  }

  @Selector([SettingsState])
  private static _legalEntityFilteringConfig(
    state: SettingsStateModel,
  ): FilteringConfig {
    return state.legalEntityGridConfig.filtering;
  }

  @Selector([SettingsState])
  private static _hasLegalEntityActiveFilters(
    state: SettingsStateModel,
  ): boolean {
    return isAnyFilterActive(state.legalEntityGridConfig.filtering);
  }

  @Selector([SettingsState])
  private static _legalEntityListCounter(state: SettingsStateModel): number {
    return state?.legalEntityListCounter;
  }

  @Selector([SettingsState])
  private static _countryList(
    state: SettingsStateModel,
  ): SettingsCompanyDetailsCountryListData[] {
    return state?.countryList;
  }

  @Selector([SettingsState])
  private static _countryActiveId(state: SettingsStateModel): number | null {
    return state?.countryActiveId;
  }

  @Selector([SettingsState])
  private static _isEditCompanyDetailsFormValid(
    state: SettingsStateModel,
  ): boolean {
    return state.isEditCompanyDetailsFormValid;
  }
}
