import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import { SiteMasterListItemModel } from '../../models';
import {
  LoadGlobalSiteMasterList,
  ResetGlobalSiteMasterState,
} from '../actions';
import { GlobalSiteMasterSelectors } from '../selectors';

@Injectable({ providedIn: 'root' })
export class GlobalSiteMasterStoreService {
  constructor(private store: Store) {}

  get siteMasterList(): Signal<SiteMasterListItemModel[]> {
    return this.store.selectSignal(GlobalSiteMasterSelectors.siteMasterList);
  }

  get siteMasterLoadingError$(): Observable<string | null> {
    return this.store.select(GlobalSiteMasterSelectors.siteMasterLoadedError);
  }

  get siteMasterLoaded$(): Observable<boolean> {
    return this.store.select(GlobalSiteMasterSelectors.siteMasterLoaded);
  }

  @Dispatch()
  loadGlobalSiteMasterList = () => new LoadGlobalSiteMasterList();

  @Dispatch()
  resetSiteMasterState = () => new ResetGlobalSiteMasterState();
}
