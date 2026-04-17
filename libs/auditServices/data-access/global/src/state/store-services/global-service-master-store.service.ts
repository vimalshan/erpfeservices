import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import { ServiceMasterListItemModel } from '../../models';
import {
  LoadGlobalServiceMasterList,
  ResetGlobalServiceMasterState,
} from '../actions';
import { GlobalServiceMasterSelectors } from '../selectors';

@Injectable({ providedIn: 'root' })
export class GlobalServiceMasterStoreService {
  constructor(private store: Store) {}

  get serviceMasterList(): Signal<ServiceMasterListItemModel[]> {
    return this.store.selectSignal(
      GlobalServiceMasterSelectors.serviceMasterList,
    );
  }

  get serviceMasterLoadingError$(): Observable<string | null> {
    return this.store.select(
      GlobalServiceMasterSelectors.serviceMasterLoadedError,
    );
  }

  get serviceMasterLoaded$(): Observable<boolean> {
    return this.store.select(GlobalServiceMasterSelectors.serviceMasterLoaded);
  }

  @Dispatch()
  loadGlobalServiceMasterList = () => new LoadGlobalServiceMasterList();

  @Dispatch()
  resetServiceMasterState = () => new ResetGlobalServiceMasterState();
}
