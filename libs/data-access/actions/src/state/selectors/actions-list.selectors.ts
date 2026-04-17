import { Selector } from '@ngxs/store';
import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';

import { ActionsModel } from '../../models';
import { ActionsListState, ActionsListStateModel } from '../actions-list.state';

export class ActionsListSelectors {
  @Selector([ActionsListState])
  static actionsDetails(state: ActionsListStateModel): ActionsModel[] {
    return state?.actions;
  }

  @Selector([ActionsListState])
  static totalFilteredRecords(state: ActionsListStateModel): number {
    return state.totalItems;
  }

  @Selector([ActionsListSelectors._dataSites])
  static dataSites(dataSites: TreeNode[]): TreeNode[] {
    return structuredClone(dataSites);
  }

  @Selector([ActionsListSelectors._dataCompanies])
  static dataCompanies(
    dataCompanies: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCompanies;
  }

  @Selector([ActionsListSelectors._dataServices])
  static dataServices(
    dataServices: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataServices;
  }

  @Selector([ActionsListSelectors._dataCategories])
  static dataCategories(
    dataCategories: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCategories;
  }

  @Selector([ActionsListSelectors._selectedSites])
  static selectedSites(selectedSites: number[]): number[] {
    return selectedSites;
  }

  @Selector([ActionsListSelectors._selectedServices])
  static selectedServices(selectedServices: number[]): number[] {
    return selectedServices;
  }

  @Selector([ActionsListSelectors._selectedCompanies])
  static selectedCompanies(selectedCompanies: number[]): number[] {
    return selectedCompanies;
  }

  @Selector([ActionsListSelectors._selectedCategories])
  static selectedCategories(selectedCategories: number[]): number[] {
    return selectedCategories;
  }

  @Selector([ActionsListState])
  static ActionCategoryFilter(
    state: ActionsListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.categoryFilter;
  }

  @Selector([ActionsListState])
  static ActionServiceFilter(
    state: ActionsListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.serviceFilter;
  }

  @Selector([ActionsListState])
  static ActionCompanyFilter(
    state: ActionsListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.companyFilter;
  }

  @Selector([ActionsListState])
  static ActionSiteFilter(state: ActionsListStateModel): TreeNode<any>[] {
    return structuredClone(state.siteFilter);
  }

  @Selector([ActionsListState])
  private static _dataSites(state: ActionsListStateModel): TreeNode[] {
    return state?.dataSites;
  }

  @Selector([ActionsListState])
  private static _dataCompanies(
    state: ActionsListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataCompanies;
  }

  @Selector([ActionsListState])
  private static _dataServices(
    state: ActionsListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataServices;
  }

  @Selector([ActionsListState])
  private static _dataCategories(
    state: ActionsListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataCategories;
  }

  @Selector([ActionsListState])
  private static _selectedCompanies(state: ActionsListStateModel): number[] {
    return state?.selectedCompanies;
  }

  @Selector([ActionsListState])
  private static _selectedCategories(state: ActionsListStateModel): number[] {
    return state?.selectedCategories;
  }

  @Selector([ActionsListState])
  private static _selectedServices(state: ActionsListStateModel): number[] {
    return state?.selectedServices;
  }

  @Selector([ActionsListState])
  private static _selectedSites(state: ActionsListStateModel): number[] {
    return state?.selectedSites;
  }
}
