import { Selector } from '@ngxs/store';

import { ServiceMasterListItemModel } from '../../models';
import { GlobalState, GlobalStateModel } from '../global.state';

export class GlobalServiceMasterSelectors {
  @Selector([GlobalServiceMasterSelectors._serviceMasterList])
  static serviceMasterList(
    serviceMasterList: ServiceMasterListItemModel[],
  ): ServiceMasterListItemModel[] {
    return serviceMasterList;
  }

  @Selector([GlobalServiceMasterSelectors._serviceLoaded])
  static serviceMasterLoaded(isLoaded: boolean): boolean {
    return isLoaded;
  }

  @Selector([GlobalServiceMasterSelectors._serviceLoadedError])
  static serviceMasterLoadedError(loadError: string): string {
    return loadError;
  }

  @Selector([GlobalState])
  private static _serviceMasterList(
    state: GlobalStateModel,
  ): ServiceMasterListItemModel[] {
    return state.serviceMaster.serviceList;
  }

  @Selector([GlobalState])
  private static _serviceLoaded(state: GlobalStateModel): boolean {
    return state.serviceMaster.loaded;
  }

  @Selector([GlobalState])
  private static _serviceLoadedError(state: GlobalStateModel): string {
    return state.serviceMaster.loadingError ?? '';
  }
}
