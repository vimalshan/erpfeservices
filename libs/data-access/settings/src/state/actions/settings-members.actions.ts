import { TreeNode } from 'primeng/api';

import { GridConfig } from '@customer-portal/shared';

import {
  MemberAreasPermissions,
  SettingsMembersItemModel,
  SettingsMembersPermissionsDataModel,
  SettingsNewMemberFormModel,
  UserDetailsToManagePermission,
} from '../../models';

export class LoadSettingsMembersList {
  static readonly type = '[Settings] Load Members List';
}

export class LoadSettingsMembersListSuccess {
  static readonly type = '[Settings] Load Members List Success';

  constructor(public membersList: SettingsMembersItemModel[]) {}
}

export class UpdateMembersGridConfig {
  static readonly type = '[Settings] Update Members Grid Config';

  constructor(public membersGridConfig: GridConfig) {}
}

export class UpdateMembersFilterOptions {
  static readonly type = '[Settings] Update Members Filter Options';
}

export class ResetMembersListState {
  static readonly type = '[Settings] Reset Members List State';
}

export class LoadSettingsAdminList {
  static readonly type = '[Settings] Load Admin List';
}

export class LoadSettingsAdminListSuccess {
  static readonly type = '[Settings] Load Admin List Success';

  constructor(public adminList: SettingsMembersItemModel[]) {}
}

export class UpdateAdminGridConfig {
  static readonly type = '[Settings] Update Admin Grid Config';

  constructor(public adminGridConfig: GridConfig) {}
}

export class UpdateAdminFilterOptions {
  static readonly type = '[Settings] Update Admin Filter Options';
}

export class ResetAdminListState {
  static readonly type = '[Settings] Reset Admin List State';
}

export class LoadMemberRoles {
  static readonly type = '[Settings] Load Members Roles';
}

export class LoadMemberRolesSuccess {
  static readonly type = '[Settings] Load Members Roles Success';

  constructor(public roles: string[]) {}
}

export class SwitchContinueToPermissionsStatus {
  static readonly type = '[Settings] Switch Continue To Permissions Status';

  constructor(public isAddMemberFormValid: boolean) {}
}

export class UpdateNewMemberForm {
  static readonly type = '[Settings] Update New Member Form';

  constructor(public newMemberForm: SettingsNewMemberFormModel) {}
}

export class ContinueToPermissions {
  static readonly type = '[Settings] Continue To Permissions';
}

export class LoadMembersPermissions {
  static readonly type = '[Settings] Load Members Permissions';
}

export class LoadMembersPermissionsSuccess {
  static readonly type = '[Settings] Load Members Permissions Success';

  constructor(public permissionsData: SettingsMembersPermissionsDataModel) {}
}

export class LoadMembersPermissionsCompanies {
  static readonly type = '[Settings] Load Members Permissions Companies';

  constructor(public companies: TreeNode[]) {}
}

export class LoadMembersPermissionsServices {
  static readonly type = '[Settings] Load Members Permissions Services';

  constructor(public services: TreeNode[]) {}
}

export class LoadMembersPermissionsSites {
  static readonly type = '[Settings] Load Members Permissions Sites';

  constructor(public sites: TreeNode[]) {}
}

export class GenerateMemberPermissionsServicesOptions {
  static readonly type =
    '[Settings] Generate Member Permissions Services Options';

  constructor(public selectedCompanyIds: number[]) {}
}

export class GenerateMemberPermissionsSitesOptions {
  static readonly type =
    '[Settings] Generate Members Permissions Sites Options';

  constructor(public selectedServiceIds: number[]) {}
}

export class SwitchMemberPermissionsServicesDropdownAccess {
  static readonly type =
    '[Settings] Switch Member Permissions Service Dropdown Access';

  constructor(public servicesDropdownDisabled: boolean) {}
}

export class SwitchMemberPermissionsSitesDropdownAccess {
  static readonly type =
    '[Settings] Switch Member Permissions Sites Dropdown Access';

  constructor(public sitesDropdownDisabled: boolean) {}
}

export class SaveMemberPermissionsCompanies {
  static readonly type = '[Settings] Save Member Permissions Companies';

  constructor(public selectedCompanyIds: number[]) {}
}

export class SaveMemberPermissionsServices {
  static readonly type = '[Settings] Save Member Permissions Services';

  constructor(public selectedServiceIds: number[]) {}
}

export class SaveMemberPermissionsSites {
  static readonly type = '[Settings] Save Member Permissions Sites';

  constructor(public selectedSiteIds: (string | number)[]) {}
}

export class SwitchHasMemberAdminPermissions {
  static readonly type =
    '[Settings] Switch Has Member Received Admin Permissions';

  constructor(public hasReceivedAdminPermissions: boolean) {}
}

export class UpdateMemberAreasPermissions {
  static readonly type = '[Settings] Update Member Areas Permissions';

  constructor(public memberAreasPermissions: MemberAreasPermissions[]) {}
}

export class DiscardNewMemberFormInfo {
  static readonly type = '[Settings] Discard New Member Form Info';
}

export class DiscardMemberPermissionsDataAndCompanies {
  static readonly type =
    '[Settings] Discard Member Permissions Data And Companies';
}

export class DiscardMemberPermissionsUserSelection {
  static readonly type = '[Settings] Discard Member Permissions';
}

export class SubmitNewMemberInfo {
  static readonly type = '[Settings] Submit New Member Info';
}

export class SubmitNewMemberInfoSuccess {
  static readonly type = '[Settings] Submit New Member Info Success';
}

export class SubmitNewMemberInfoError {
  static readonly type = '[Settings] Submit New Member Info Error';
}

export class RemoveMember {
  static readonly type = '[Settings] Remove Member';

  constructor(public email: string) {}
}

export class RemoveMemberSuccess {
  static readonly type = '[Settings] Remove Member Success';
}

export class RemoveMemberError {
  static readonly type = '[Settings] Remove Member Error';
}

export class LoadUserDetailsToManagePermission {
  static readonly type = '[Settings] Load User Details To Manage Permission';

  constructor(public memberEmail: string) {}
}

export class LoadUserDetailsToManagePermissionSuccess {
  static readonly type =
    '[Settings] Load User Details To Manage Permission Success';

  constructor(
    public userDetailsToManagePermission: UserDetailsToManagePermission,
  ) {}
}

export class SubmitManageMembersPermissions {
  static readonly type = '[Settings] Submit Manage Members Permissions';
}

export class SubmitManageMembersPermissionsSuccess {
  static readonly type = '[Settings] Submit Manage Members Permissions Success';
}

export class SubmitManageMembersPermissionsError {
  static readonly type = '[Settings] Submit Manage Members Permissions Error';
}

export class ChangeEditManagePermissionsPristineForm {
  static readonly type =
    '[Settings] Change Edit Manage Permissions Pristine Form';

  constructor(public isPristine: boolean) {}
}
