import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { CoBrowsingCompany } from '../../models';
import {
  GetCompanyList,
  ResetSelectedCobrowsingCompany,
  UpdateImpersonatedUser,
  UpdateIsSuaadhyaUser,
  UpdateSelectedCobrowsingCompany,
} from '../actions';
import { CoBrowsingSelectors } from '../selectors';

@Injectable({ providedIn: 'root' })
export class SettingsCoBrowsingStoreService {
  get adminViewCompanyList(): Signal<CoBrowsingCompany[]> {
    return this.store.selectSignal(CoBrowsingSelectors.adminViewCompanyList);
  }

  get selectedCoBrowsingCompany(): Signal<any> {
    return this.store.selectSignal(
      CoBrowsingSelectors.selectedCoBrowsingCompany,
    );
  }

  get isSuaadhyaUser(): Signal<boolean> {
    return this.store.selectSignal(CoBrowsingSelectors.isSuaadhyaUser);
  }

  constructor(private store: Store) {}

  @Dispatch()
  updateIsSuaadhyaUser = (isSuaadhyaUser: boolean) => new UpdateIsSuaadhyaUser(isSuaadhyaUser);

  @Dispatch()
  getCompanyList = () => new GetCompanyList();

  @Dispatch()
  updateSelectedCoBrowsingCompany = (selectedCompany: CoBrowsingCompany) =>
    new UpdateSelectedCobrowsingCompany(selectedCompany);

  @Dispatch()
  resetSelectedCobrowsingCompany = () => new ResetSelectedCobrowsingCompany();

  @Dispatch()
  updateImpersonatedUser = (impersonatedUser: string | null) =>
    new UpdateImpersonatedUser(impersonatedUser);
}
