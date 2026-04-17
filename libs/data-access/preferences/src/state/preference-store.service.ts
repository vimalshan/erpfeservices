import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';

import { ObjectName, ObjectType, PageName } from '@customer-portal/shared';

import { PreferenceModel } from '../models';
import { LoadPreference, SavePreference } from './preference.actions';
import { PreferenceSelectors } from './preference.selectors';

@Injectable({ providedIn: 'root' })
export class PreferenceStoreService {
  constructor(private readonly store: Store) {}

  getData(pageName: PageName, objectName: ObjectName, objectType: ObjectType) {
    return this.store.selectSignal(
      PreferenceSelectors.data(pageName, objectName, objectType),
    );
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(PreferenceSelectors.isLoading);
  }

  get error(): Signal<string | null> {
    return this.store.selectSignal(PreferenceSelectors.error);
  }

  loadPreference = (
    pageName: PageName,
    objectName: ObjectName,
    objectType: ObjectType,
  ) =>
    this.store.dispatch(new LoadPreference(pageName, objectName, objectType));

  savePreference = (preference: PreferenceModel) =>
    this.store.dispatch(new SavePreference(preference));
}
