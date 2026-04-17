import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs';

import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';

import { PreferenceModel } from '../models';
import { PreferenceMapperService, PreferenceService } from '../services';
import {
  LoadPreference,
  LoadPreferenceFail,
  LoadPreferenceSuccess,
  SavePreference,
} from './preference.actions';

export interface PreferenceStateModel {
  preferenceItems: PreferenceModel[];
  isLoading: boolean;
  error: string | null;
}

const defaultState: PreferenceStateModel = {
  preferenceItems: [],
  isLoading: false,
  error: null,
};

@State<PreferenceStateModel>({
  name: 'preferences',
  defaults: defaultState,
})
@Injectable()
export class PreferenceState {
  constructor(private preferenceService: PreferenceService) {}

  @Action(LoadPreference)
  loadPreference(
    ctx: StateContext<PreferenceStateModel>,
    { objectName, objectType, pageName }: LoadPreference,
  ) {
    ctx.patchState({ isLoading: true, error: null });

    return this.preferenceService
      .getPreference(objectType, objectName, pageName)
      .pipe(
        throwIfNotSuccess(),
        tap((preferenceDto) => {
          const preference =
            PreferenceMapperService.mapToPreferenceModel(preferenceDto);
          ctx.dispatch(new LoadPreferenceSuccess(preference));
        }),
        catchError((err) => ctx.dispatch(new LoadPreferenceFail(err))),
      );
  }

  @Action(LoadPreferenceSuccess)
  loadPreferenceSuccess(
    ctx: StateContext<PreferenceStateModel>,
    { preference }: LoadPreferenceSuccess,
  ) {
    if (!preference) {
      return;
    }

    const state = ctx.getState();
    const preferenceItems = state.preferenceItems
      .filter(
        (item) =>
          item.pageName !== preference.pageName ||
          item.objectType !== preference.objectType ||
          item.objectName !== preference.objectName,
      )
      .concat(preference);

    ctx.patchState({
      preferenceItems,
    });
  }

  @Action(LoadPreferenceFail)
  loadPreferenceFail(
    ctx: StateContext<PreferenceStateModel>,
    { error }: LoadPreferenceFail,
  ) {
    let message = 'Failed to load preferences';

    if (typeof error === 'object' && error && 'message' in error) {
      message = error['message'] || message;
    } else if (typeof error === 'string') {
      message = error;
    }
    ctx.patchState({ isLoading: false, error: message });
  }

  @Action(SavePreference)
  savePreference(
    ctx: StateContext<PreferenceStateModel>,
    { preference }: SavePreference,
  ) {
    const dto = PreferenceMapperService.mapToPreferenceDto(preference);

    return this.preferenceService.savePreferences(dto);
  }
}
