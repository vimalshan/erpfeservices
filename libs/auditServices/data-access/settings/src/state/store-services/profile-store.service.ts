import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import {
  ProfileInformationModel,
  SidebarGroup,
  UserPermissions,
} from '../../models';
import {
  LoadProfileData,
  LoadUserRoles,
  ResetProfileLoadAndErrorState,
  SetInitialLoginStatus,
  UpdateSubmitSettingsStateValues,
  UpdateSubmitSettingsStatus,
  UpdateSubmitSettingsValues,
} from '../actions';
import { ProfileSelectors } from '../selectors/profile.selectors';

@Injectable({
  providedIn: 'root',
})
export class ProfileStoreService {
  get profileInformation(): Signal<ProfileInformationModel> {
    return this.store.selectSignal(ProfileSelectors.profileInformation);
  }

  get initialLoginStatus(): Signal<boolean> {
    return this.store.selectSignal(ProfileSelectors.isInitialLoginStatus);
  }

  get sidebarMenu(): Signal<SidebarGroup[]> {
    return this.store.selectSignal(ProfileSelectors.sidebarMenu);
  }

  get submitSettingsStatus(): Signal<boolean> {
    return this.store.selectSignal(ProfileSelectors.submitSettingsStatus);
  }

  get profileInformationAccessLevel(): Observable<UserPermissions> {
    return this.store.select(ProfileSelectors.profileInformationAccessLevel);
  }

  get userRoles(): Signal<string[]> {
    return this.store.selectSignal(ProfileSelectors.userRoles);
  }

  get profileDataError$(): Observable<string | null> {
    return this.store.select(
      (state) => state.settings.loadingErrors.profileData,
    );
  }

  get profileDataLoaded$(): Observable<boolean> {
    return this.store.select(
      (state) => state.settings.loadedStates.profileData,
    );
  }

  constructor(private store: Store) {}

  @Dispatch()
  loadProfileData = () => new LoadProfileData();

  @Dispatch()
  setInitialLoginStatus = (isInitialLogin: boolean) =>
    new SetInitialLoginStatus(isInitialLogin);

  @Dispatch()
  updateSubmitSettingsStatus = (isValid: boolean) =>
    new UpdateSubmitSettingsStatus(isValid);

  @Dispatch()
  updateSubmitSettingsStateValues = (formValue: any) =>
    new UpdateSubmitSettingsStateValues(formValue);

  @Dispatch()
  updateSubmitSettingsValues = () => new UpdateSubmitSettingsValues();

  @Dispatch()
  loadUserRoles = () => new LoadUserRoles();

  @Dispatch()
  resetProfileLoadAndErrorState = () => new ResetProfileLoadAndErrorState();

  hasPermission(
    category: string,
    permission: keyof UserPermissions[string],
  ): Signal<boolean> {
    return this.store.selectSignal(
      ProfileSelectors.hasPermission(category, permission),
    );
  }
}
