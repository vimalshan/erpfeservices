import { createSelector, Selector } from '@ngxs/store';

import {
  ProfileInformationModel,
  SidebarGroup,
  UserPermissions,
} from '../../models';
import { SettingsState, SettingsStateModel } from '../settings.state';

export class ProfileSelectors {
  @Selector([ProfileSelectors._profileInformation])
  static profileInformation(
    profileInformation: ProfileInformationModel,
  ): ProfileInformationModel {
    return profileInformation;
  }

  @Selector([ProfileSelectors._isInitialLoginStatus])
  static isInitialLoginStatus(isInitialLoginStatus: boolean): boolean {
    return isInitialLoginStatus;
  }

  @Selector([ProfileSelectors._profileInformationAccessLevel])
  static profileInformationAccessLevel(
    profileInformationAccessLevel: UserPermissions,
  ): UserPermissions {
    return profileInformationAccessLevel;
  }

  @Selector([ProfileSelectors._sidebarMenu])
  static sidebarMenu(sidebarMenu: SidebarGroup[]): SidebarGroup[] {
    return sidebarMenu;
  }

  @Selector([ProfileSelectors._submitSettingsStatus])
  static submitSettingsStatus(submitSettingsStatus: boolean): boolean {
    return submitSettingsStatus;
  }

  @Selector([ProfileSelectors._userRoles])
  static userRoles(userRoles: string[]): string[] {
    return userRoles;
  }

  static hasPermission(
    category: string,
    permission: keyof UserPermissions[string],
  ): (state: SettingsStateModel) => boolean {
    return createSelector(
      [SettingsState],
      (state: SettingsStateModel) =>
        !!state.information.accessLevel[category]?.[permission],
    );
  }

  @Selector([SettingsState])
  private static _profileInformation(
    state: SettingsStateModel,
  ): ProfileInformationModel {
    return state.information;
  }

  @Selector([SettingsState])
  private static _isInitialLoginStatus(state: SettingsStateModel): boolean {
    return state.isInitialLogin;
  }

  @Selector([SettingsState])
  private static _profileInformationAccessLevel(
    state: SettingsStateModel,
  ): UserPermissions {
    return state.information.accessLevel;
  }

  @Selector([SettingsState])
  private static _sidebarMenu(state: SettingsStateModel): SidebarGroup[] {
    return state.information.sidebarMenu;
  }

  @Selector([SettingsState])
  private static _submitSettingsStatus(state: SettingsStateModel): boolean {
    return state.submitSettingsStatus;
  }

  @Selector([SettingsState])
  private static _userRoles(state: SettingsStateModel): string[] {
    return state.userRoles;
  }
}
