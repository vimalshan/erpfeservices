import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import {
  GridConfig,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared/models';

import { ActionFilterKey } from '../../constants';
import { ActionsModel } from '../../models';
import {
  ClearActionFilter,
  LoadActionFilterCategories,
  LoadActionFilterCompanies,
  LoadActionFilterServices,
  LoadActionFilterSites,
  LoadActionsDetails,
  LoadActionsFilterList,
  LoadHighPriorityAction,
  NavigateFromAction,
  UpdateActionFilterByKey,
  UpdateActionFilterCategories,
  UpdateActionFilterCompanies,
  UpdateActionFilterServices,
  UpdateActionFilterSites,
  UpdateGridConfig,
} from '../actions';
import { ActionsListSelectors } from '../selectors';

@Injectable()
export class ActionsListStoreService {
  get actionsDetails(): Signal<ActionsModel[]> {
    return this.store.selectSignal(ActionsListSelectors.actionsDetails);
  }

  get totalRecords(): Signal<number> {
    return this.store.selectSignal(ActionsListSelectors.totalFilteredRecords);
  }

  get actionCategoryFilter(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(ActionsListSelectors.ActionCategoryFilter);
  }

  get actionServicesFilter(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(ActionsListSelectors.ActionServiceFilter);
  }

  get actionCompaniesFilter(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(ActionsListSelectors.ActionCompanyFilter);
  }

  get actionSitesFilter(): Signal<TreeNode[]> {
    return this.store.selectSignal(ActionsListSelectors.ActionSiteFilter);
  }

  get dataSites(): Signal<TreeNode[]> {
    return this.store.selectSignal(ActionsListSelectors.dataSites);
  }

  get dataCompanies(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(ActionsListSelectors.dataCompanies);
  }

  get dataServices(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(ActionsListSelectors.dataServices);
  }

  get dataCategories(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(ActionsListSelectors.dataCategories);
  }

  get filterSites(): Signal<number[]> {
    return this.store.selectSignal(ActionsListSelectors.selectedSites);
  }

  get filterCompanies(): Signal<number[]> {
    return this.store.selectSignal(ActionsListSelectors.selectedCompanies);
  }

  get filterServices(): Signal<number[]> {
    return this.store.selectSignal(ActionsListSelectors.selectedServices);
  }

  get filterCategories(): Signal<number[]> {
    return this.store.selectSignal(ActionsListSelectors.selectedCategories);
  }

  constructor(private store: Store) {}

  @Dispatch()
  loadActionsDetails = () => new LoadActionsDetails();

  @Dispatch()
  loadActionsFilterList = () => new LoadActionsFilterList();

  @Dispatch()
  loadActionFilterCategories = () => new LoadActionFilterCategories();

  @Dispatch()
  updateActionFilterCategories = (data: number[]) =>
    new UpdateActionFilterCategories(data);

  @Dispatch()
  loadActionFilterServices = () => new LoadActionFilterServices();

  @Dispatch()
  updateActionFilterServices = (data: number[]) =>
    new UpdateActionFilterServices(data);

  @Dispatch()
  loadActionFilterCompanies = () => new LoadActionFilterCompanies();

  @Dispatch()
  UpdateActionFilterCompanies = (data: number[]) =>
    new UpdateActionFilterCompanies(data);

  @Dispatch()
  loadActionFilterSites = () => new LoadActionFilterSites();

  @Dispatch()
  updateActionFilterSites = (data: SharedSelectTreeChangeEventOutput) =>
    new UpdateActionFilterSites(data);

  @Dispatch()
  updateActionFilterByKey = (data: unknown, key: ActionFilterKey) =>
    new UpdateActionFilterByKey(data, key);

  @Dispatch()
  updateGridConfig = (gridConfig: GridConfig) =>
    new UpdateGridConfig(gridConfig);

  @Dispatch()
  loadHighPriorityAction = (isHighPriority: boolean) =>
    new LoadHighPriorityAction(isHighPriority);

  @Dispatch()
  navigateFromAction = (id: string, type: string) =>
    new NavigateFromAction(id, type);

  @Dispatch()
  clearActionFilter = () => new ClearActionFilter();
}
