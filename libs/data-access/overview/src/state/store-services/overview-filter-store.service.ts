import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TreeNode } from 'primeng/api';

import {
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { OverviewFilterKey } from '../../models';
import {
  LoadOverviewFilterCompanies,
  LoadOverviewFilterList,
  LoadOverviewFilterServices,
  LoadOverviewFilterSites,
  UpdateOverviewFilterByKey,
  UpdateOverviewFilterCompanies,
  UpdateOverviewFilterServices,
  UpdateOverviewFilterSites,
} from '../actions';
import { OverviewFilterSelectors } from '../selectors';

@Injectable()
export class OverviewFilterStoreService {
  constructor(private store: Store) {}

  get dataCompanies(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(OverviewFilterSelectors.dataCompanies);
  }

  get dataServices(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(OverviewFilterSelectors.dataServices);
  }

  get dataSites(): Signal<TreeNode[]> {
    return this.store.selectSignal(OverviewFilterSelectors.dataSites);
  }

  get filterCompanies(): Signal<number[]> {
    return this.store.selectSignal(OverviewFilterSelectors.filterCompanies);
  }

  get filterServices(): Signal<number[]> {
    return this.store.selectSignal(OverviewFilterSelectors.filterServices);
  }

  get filterSites(): Signal<number[]> {
    return this.store.selectSignal(OverviewFilterSelectors.filterSites);
  }

  @Dispatch()
  loadOverviewFilterList = () => new LoadOverviewFilterList();

  @Dispatch()
  loadOverviewFilterCompanies = () => new LoadOverviewFilterCompanies();

  @Dispatch()
  loadOverviewFilterServices = () => new LoadOverviewFilterServices();

  @Dispatch()
  loadOverviewFilterSites = () => new LoadOverviewFilterSites();

  @Dispatch()
  updateOverviewFilterByKey = (data: unknown, key: OverviewFilterKey) =>
    new UpdateOverviewFilterByKey(data, key);

  @Dispatch()
  updateOverviewFilterCompanies = (data: number[]) =>
    new UpdateOverviewFilterCompanies(data);

  @Dispatch()
  updateOverviewFilterServices = (data: number[]) =>
    new UpdateOverviewFilterServices(data);

  @Dispatch()
  updateOverviewFilterSites = (data: SharedSelectTreeChangeEventOutput) =>
    new UpdateOverviewFilterSites(data);
}
