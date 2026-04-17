import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { filter, map, tap } from 'rxjs';

import { ServiceMasterListItemModel, SiteMasterListItemModel } from '../models';
import { ServiceMasterListService, SiteMasterListService } from '../services';
import {
  LoadGlobalServiceMasterList,
  LoadGlobalSiteMasterList,
  ResetGlobalServiceMasterState,
  ResetGlobalSiteMasterState,
} from './actions';

export interface GlobalStateModel {
  siteMaster: {
    siteList: SiteMasterListItemModel[];
    loaded: boolean;
    loadingError: string | null;
  };
  serviceMaster: {
    serviceList: ServiceMasterListItemModel[];
    loaded: boolean;
    loadingError: string | null;
  };
}

const defaultState: GlobalStateModel = {
  siteMaster: {
    siteList: [],
    loaded: false,
    loadingError: null,
  },
  serviceMaster: {
    serviceList: [],
    loaded: false,
    loadingError: null,
  },
};

@State<GlobalStateModel>({
  name: 'global',
  defaults: defaultState,
})
@Injectable()
export class GlobalState {
  constructor(
    private readonly siteMasterListService: SiteMasterListService,
    private readonly serviceMasterListService: ServiceMasterListService,
  ) {}

  @Action(LoadGlobalSiteMasterList)
  loadGlobalSiteMasterList(ctx: StateContext<GlobalStateModel>) {
    return this.siteMasterListService.getSiteMasterList().pipe(
      map((siteMasterDto) => {
        if (!siteMasterDto || !siteMasterDto.isSuccess) {
          const errorMessage =
            siteMasterDto?.message || 'Failed to load site master data';
          ctx.patchState({
            siteMaster: {
              siteList: [],
              loadingError: errorMessage,
              loaded: true,
            },
          });

          return siteMasterDto;
        }

        return siteMasterDto;
      }),
      filter((siteMasterDto) => siteMasterDto?.isSuccess ?? false),
      tap((siteMasterDto) => {
        ctx.patchState({
          siteMaster: {
            siteList: siteMasterDto?.data ?? [],
            loadingError: null,
            loaded: true,
          },
        });
      }),
    );
  }

  @Action(LoadGlobalServiceMasterList)
  loadGlobalServiceMasterList(ctx: StateContext<GlobalStateModel>) {
    return this.serviceMasterListService.getServiceMasterList().pipe(
      map((serviceMasterDto) => {
        if (!serviceMasterDto || !serviceMasterDto.isSuccess) {
          const errorMessage =
            serviceMasterDto?.message || 'Failed to load service master data';
          ctx.patchState({
            serviceMaster: {
              serviceList: [],
              loadingError: errorMessage,
              loaded: true,
            },
          });

          return serviceMasterDto;
        }

        return serviceMasterDto;
      }),
      filter((serviceMasterDto) => serviceMasterDto?.isSuccess ?? false),
      tap((serviceMasterDto) => {
        ctx.patchState({
          serviceMaster: {
            serviceList: serviceMasterDto?.data ?? [],
            loadingError: null,
            loaded: true,
          },
        });
      }),
    );
  }

  @Action(ResetGlobalSiteMasterState)
  resetGlobalSiteMasterState(ctx: StateContext<GlobalStateModel>): void {
    ctx.patchState({
      siteMaster: {
        siteList: [],
        loadingError: null,
        loaded: false,
      },
    });
  }

  @Action(ResetGlobalServiceMasterState)
  resetGlobalServiceMasterState(ctx: StateContext<GlobalStateModel>): void {
    ctx.patchState({
      serviceMaster: {
        serviceList: [],
        loadingError: null,
        loaded: false,
      },
    });
  }
}
