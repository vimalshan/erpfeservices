import { Selector } from '@ngxs/store';

import { CoBrowsingCompany } from '../../models';
import { SettingsState, SettingsStateModel } from '../settings.state';

export class CoBrowsingSelectors {
  @Selector([CoBrowsingSelectors._adminViewCompanyList])
  static adminViewCompanyList(
    adminViewCompanyList: CoBrowsingCompany[],
  ): CoBrowsingCompany[] {
    return adminViewCompanyList;
  }

  @Selector([CoBrowsingSelectors._selectedCoBrowsingCompany])
  static selectedCoBrowsingCompany(
    selectedCoBrowsingCompany: CoBrowsingCompany | null,
  ): CoBrowsingCompany | null {
    return selectedCoBrowsingCompany;
  }

  @Selector([CoBrowsingSelectors._isSuaadhyaUser])
  static isSuaadhyaUser(isSuaadhyaUser: boolean) {
    return isSuaadhyaUser;
  }

  @Selector([SettingsState])
  private static _adminViewCompanyList(
    state: SettingsStateModel,
  ): CoBrowsingCompany[] {
    return state.adminViewCompanyList;
  }

  @Selector([SettingsState])
  private static _selectedCoBrowsingCompany(
    state: SettingsStateModel,
  ): CoBrowsingCompany | null {
    return state.selectedCoBrowsingCompany;
  }

  @Selector([SettingsState])
  private static _isSuaadhyaUser(state: SettingsStateModel): boolean {
    return state.isSuaadhyaUser;
  }
}
