import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';

import {
  FilteringConfig,
  FilterOptions,
  GridConfig,
} from '@customer-portal/shared';

import {
  MemberAreasPermissions,
  SelectedUserDetailsModel,
  SettingsNewMemberFormModel,
  UserDetailsToManagePermission,
} from '../../models';
import {
  ChangeEditManagePermissionsPristineForm,
  ContinueToPermissions,
  DiscardMemberPermissionsDataAndCompanies,
  DiscardMemberPermissionsUserSelection,
  DiscardNewMemberFormInfo,
  LoadMemberRoles,
  LoadMembersPermissions,
  LoadSettingsAdminList,
  LoadSettingsMembersList,
  LoadUserDetailsToManagePermission,
  RemoveMember,
  ResetAdminListState,
  ResetMembersListState,
  SaveMemberPermissionsCompanies,
  SaveMemberPermissionsServices,
  SaveMemberPermissionsSites,
  SubmitManageMembersPermissions,
  SubmitNewMemberInfo,
  SwitchContinueToPermissionsStatus,
  SwitchHasMemberAdminPermissions,
  UpdateAdminGridConfig,
  UpdateMemberAreasPermissions,
  UpdateMembersGridConfig,
  UpdateNewMemberForm,
} from '../actions';
import { SettingsMembersSelectors } from '../selectors';

@Injectable({ providedIn: 'root' })
export class SettingsMembersStoreService {
  constructor(private store: Store) {}

  get settingsMembersList() {
    return this.store.selectSignal(
      SettingsMembersSelectors.settingsMembersList,
    );
  }

  get membersTotalFilteredRecords(): Signal<number> {
    return this.store.selectSignal(
      SettingsMembersSelectors.membersTotalFilteredRecords,
    );
  }

  get hasMembersActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(
      SettingsMembersSelectors.hasMembersActiveFilters,
    );
  }

  get membersFilterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(
      SettingsMembersSelectors.membersFilterOptions,
    );
  }

  get membersFilteringConfig(): Observable<FilteringConfig> {
    return this.store.select(SettingsMembersSelectors.membersFilteringConfig);
  }

  get settingsAdminList() {
    return this.store.selectSignal(SettingsMembersSelectors.settingsAdminList);
  }

  get adminTotalFilteredRecords(): Signal<number> {
    return this.store.selectSignal(
      SettingsMembersSelectors.adminTotalFilteredRecords,
    );
  }

  get hasAdminActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(
      SettingsMembersSelectors.hasAdminActiveFilters,
    );
  }

  get adminFilterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(SettingsMembersSelectors.adminFilterOptions);
  }

  get adminFilteringConfig(): Observable<FilteringConfig> {
    return this.store.select(SettingsMembersSelectors.adminFilteringConfig);
  }

  get memberRoles(): Signal<string[]> {
    return this.store.selectSignal(SettingsMembersSelectors.memberRoles);
  }

  get isAddMemberFormValid(): Signal<boolean> {
    return this.store.selectSignal(
      SettingsMembersSelectors.isAddMemberFormValid,
    );
  }

  get companies(): Signal<TreeNode[]> {
    return this.store.selectSignal(SettingsMembersSelectors.companies);
  }

  get sites(): Signal<TreeNode[]> {
    return this.store.selectSignal(SettingsMembersSelectors.sites);
  }

  get services(): Signal<TreeNode[]> {
    return this.store.selectSignal(SettingsMembersSelectors.services);
  }

  get newMemberForm(): Signal<SettingsNewMemberFormModel | null> {
    return this.store.selectSignal(SettingsMembersSelectors.newMemberForm);
  }

  get isServicesDropdownDisabled(): Signal<boolean> {
    return this.store.selectSignal(
      SettingsMembersSelectors.isServicesDropdownDisabled,
    );
  }

  get isSitesDropdownDisabled(): Signal<boolean> {
    return this.store.selectSignal(
      SettingsMembersSelectors.isSitesDropdownDisabled,
    );
  }

  get hasReceivedAdminPermissions(): Signal<boolean> {
    return this.store.selectSignal(
      SettingsMembersSelectors.hasReceivedAdminPermissions,
    );
  }

  get memberAreasPermissions(): Signal<MemberAreasPermissions[]> {
    return this.store.selectSignal(
      SettingsMembersSelectors.memberAreasPermissions,
    );
  }

  get hasMemberPermissionsChanged(): Signal<boolean> {
    return this.store.selectSignal(
      SettingsMembersSelectors.hasMemberPermissionsChanged,
    );
  }

  get canMemberInfoBeSubmitted(): Signal<boolean> {
    return this.store.selectSignal(
      SettingsMembersSelectors.canMemberInfoBeSubmitted,
    );
  }

  get userDetailsToManagePermission(): Signal<UserDetailsToManagePermission | null> {
    return this.store.selectSignal(
      SettingsMembersSelectors.userDetailsToManagePermission,
    );
  }

  get selectedUserDetails(): Signal<SelectedUserDetailsModel | null> {
    return this.store.selectSignal(
      SettingsMembersSelectors.selectedUserDetails,
    );
  }

  get isEditManagePermissionsFormPristine(): Signal<boolean> {
    return this.store.selectSignal(
      SettingsMembersSelectors.isEditManagePermissionsFormPristine,
    );
  }

  @Dispatch()
  loadSettingsMembersList = () => new LoadSettingsMembersList();

  @Dispatch()
  updateMembersGridConfig = (gridConfig: GridConfig) =>
    new UpdateMembersGridConfig(gridConfig);

  @Dispatch()
  resetMembersListState = () => new ResetMembersListState();

  @Dispatch()
  loadSettingsAdminList = () => new LoadSettingsAdminList();

  @Dispatch()
  updateAdminGridConfig = (gridConfig: GridConfig) =>
    new UpdateAdminGridConfig(gridConfig);

  @Dispatch()
  resetAdminListState = () => new ResetAdminListState();

  @Dispatch()
  loadMemberRoles = () => new LoadMemberRoles();

  @Dispatch()
  switchContinueToPermissionsStatus = (isValid: boolean) =>
    new SwitchContinueToPermissionsStatus(isValid);

  @Dispatch()
  updateNewMemberForm = (formValue: SettingsNewMemberFormModel) =>
    new UpdateNewMemberForm(formValue);

  @Dispatch()
  continueToPermissions = () => new ContinueToPermissions();

  @Dispatch()
  loadMembersPermissions = () => new LoadMembersPermissions();

  @Dispatch()
  saveMemberPermissionsCompanies = (selectedCompanyIds: number[]) =>
    new SaveMemberPermissionsCompanies(selectedCompanyIds);

  @Dispatch()
  saveMemberPermissionsServices = (selectedServiceIds: number[]) =>
    new SaveMemberPermissionsServices(selectedServiceIds);

  @Dispatch()
  saveMemberPermissionsSites = (selectedSiteIds: (string | number)[]) =>
    new SaveMemberPermissionsSites(selectedSiteIds);

  @Dispatch()
  changeReceivedAdminPermissions = (hasReceivedAdminPermissions: boolean) =>
    new SwitchHasMemberAdminPermissions(hasReceivedAdminPermissions);

  @Dispatch()
  updateMemberAreasPermissions = (areas: MemberAreasPermissions[]) =>
    new UpdateMemberAreasPermissions(areas);

  @Dispatch()
  discardNewMemberFormInfo = () => new DiscardNewMemberFormInfo();

  @Dispatch()
  discardMemberPermissionsDataAndCompanies = () =>
    new DiscardMemberPermissionsDataAndCompanies();

  @Dispatch()
  discardMemberPermissionsUserSelection = () =>
    new DiscardMemberPermissionsUserSelection();

  @Dispatch()
  submitNewMemberInfo = () => new SubmitNewMemberInfo();

  @Dispatch()
  removeMember = (email: string) => new RemoveMember(email);

  @Dispatch()
  loadUserDetailsToManagePermission = (memberEmail: string) =>
    new LoadUserDetailsToManagePermission(memberEmail);

  @Dispatch()
  submitManageMembersPermissions = () => new SubmitManageMembersPermissions();

  @Dispatch()
  changeEditManagePermissionsPristineForm = (isPristine: boolean) =>
    new ChangeEditManagePermissionsPristineForm(isPristine);
}
