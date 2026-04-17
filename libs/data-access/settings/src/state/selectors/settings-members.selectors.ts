import { Selector } from '@ngxs/store';
import { TreeNode } from 'primeng/api';

import {
  applyGridConfig,
  getNumberOfFilteredRecords,
  isAnyFilterActive,
} from '@customer-portal/shared/helpers/grid';
import {
  FilteringConfig,
  FilterOptions,
} from '@customer-portal/shared/models/grid';

import {
  MemberAreaPermissions,
  MemberAreasPermissions,
  SelectedUserDetailsModel,
  SettingsMembersItemModel,
  SettingsNewMemberFormModel,
  UserDetailsToManagePermission,
} from '../../models';
import { SettingsState, SettingsStateModel } from '../settings.state';

export class SettingsMembersSelectors {
  @Selector([SettingsMembersSelectors._settingsMembersList])
  static settingsMembersList(
    settingsMembersList: SettingsMembersItemModel[],
  ): SettingsMembersItemModel[] {
    return settingsMembersList;
  }

  @Selector([SettingsMembersSelectors._membersTotalFilteredRecords])
  static membersTotalFilteredRecords(
    membersTotalFilteredRecords: number,
  ): number {
    return membersTotalFilteredRecords;
  }

  @Selector([SettingsMembersSelectors._membersFilterOptions])
  static membersFilterOptions(
    membersFilterOptions: FilterOptions,
  ): FilterOptions {
    return membersFilterOptions;
  }

  @Selector([SettingsMembersSelectors._membersFilteringConfig])
  static membersFilteringConfig(
    membersFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return membersFilteringConfig;
  }

  @Selector([SettingsMembersSelectors._hasMembersActiveFilters])
  static hasMembersActiveFilters(hasMembersActiveFilters: boolean): boolean {
    return hasMembersActiveFilters;
  }

  @Selector([SettingsMembersSelectors._settingsAdminList])
  static settingsAdminList(
    settingsAdminList: SettingsMembersItemModel[],
  ): SettingsMembersItemModel[] {
    return settingsAdminList;
  }

  @Selector([SettingsMembersSelectors._adminTotalFilteredRecords])
  static adminTotalFilteredRecords(adminTotalFilteredRecords: number): number {
    return adminTotalFilteredRecords;
  }

  @Selector([SettingsMembersSelectors._adminFilterOptions])
  static adminFilterOptions(adminFilterOptions: FilterOptions): FilterOptions {
    return adminFilterOptions;
  }

  @Selector([SettingsMembersSelectors._adminFilteringConfig])
  static adminFilteringConfig(
    adminFilteringConfig: FilteringConfig,
  ): FilteringConfig {
    return adminFilteringConfig;
  }

  @Selector([SettingsMembersSelectors._hasAdminActiveFilters])
  static hasAdminActiveFilters(hasAdminActiveFilters: boolean): boolean {
    return hasAdminActiveFilters;
  }

  @Selector([SettingsMembersSelectors._memberRoles])
  static memberRoles(memberRoles: string[]): string[] {
    return memberRoles;
  }

  @Selector([SettingsMembersSelectors._isAddMemberFormValid])
  static isAddMemberFormValid(isAddMemberFormValid: boolean): boolean {
    return isAddMemberFormValid;
  }

  @Selector([SettingsMembersSelectors._companies])
  static companies(companies: TreeNode[]): TreeNode[] {
    return structuredClone(companies);
  }

  @Selector([SettingsMembersSelectors._services])
  static services(services: TreeNode[]): TreeNode[] {
    return structuredClone(services);
  }

  @Selector([SettingsMembersSelectors._sites])
  static sites(sites: TreeNode[]): TreeNode[] {
    return structuredClone(sites);
  }

  @Selector([SettingsMembersSelectors._newMemberForm])
  static newMemberForm(
    newMemberForm: SettingsNewMemberFormModel | null,
  ): SettingsNewMemberFormModel | null {
    return newMemberForm;
  }

  @Selector([SettingsMembersSelectors._isServicesDropdownDisabled])
  static isServicesDropdownDisabled(
    isServicesDropdownDisabled: boolean,
  ): boolean {
    return isServicesDropdownDisabled;
  }

  @Selector([SettingsMembersSelectors._isSitesDropdownDisabled])
  static isSitesDropdownDisabled(isSitesDropdownDisabled: boolean): boolean {
    return isSitesDropdownDisabled;
  }

  @Selector([SettingsMembersSelectors._hasReceivedAdminPermissions])
  static hasReceivedAdminPermissions(
    hasReceivedAdminPermissions: boolean,
  ): boolean {
    return hasReceivedAdminPermissions;
  }

  @Selector([SettingsMembersSelectors._memberAreasPermissions])
  static memberAreasPermissions(
    memberAreasPermissions: MemberAreasPermissions[],
  ): MemberAreasPermissions[] {
    return memberAreasPermissions;
  }

  @Selector([SettingsMembersSelectors._hasMemberPermissionsChanged])
  static hasMemberPermissionsChanged(
    hasMemberPermissionsChanged: boolean,
  ): boolean {
    return hasMemberPermissionsChanged;
  }

  @Selector([SettingsMembersSelectors._canMemberInfoBeSubmitted])
  static canMemberInfoBeSubmitted(canMemberInfoBeSubmitted: boolean): boolean {
    return canMemberInfoBeSubmitted;
  }

  @Selector([SettingsMembersSelectors._userDetailsToManagePermission])
  static userDetailsToManagePermission(
    userDetailsToManagePermission: UserDetailsToManagePermission | null,
  ) {
    return userDetailsToManagePermission;
  }

  @Selector([SettingsMembersSelectors._isEditManagePermissionsFormPristine])
  static isEditManagePermissionsFormPristine(
    isEditManagePermissionsFormPristine: boolean,
  ) {
    return isEditManagePermissionsFormPristine;
  }

  @Selector([SettingsMembersSelectors._selectedUserDetails])
  static selectedUserDetails(
    selectedUserDetails: SelectedUserDetailsModel | null,
  ) {
    return selectedUserDetails;
  }

  @Selector([SettingsState])
  private static _selectedUserDetails(
    state: SettingsStateModel,
  ): SelectedUserDetailsModel | null {
    const { permissionsData } = state;
    const userDetails = permissionsData?.data[0];

    if (!userDetails) {
      return null;
    }

    return {
      jobTitle: userDetails.jobTitle,
      email: userDetails.emailId,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
    };
  }

  @Selector([SettingsState])
  private static _settingsMembersList(
    state: SettingsStateModel,
  ): SettingsMembersItemModel[] {
    const { membersList, membersGridConfig } = state;

    return applyGridConfig(membersList, membersGridConfig);
  }

  @Selector([SettingsState])
  private static _membersTotalFilteredRecords(
    state: SettingsStateModel,
  ): number {
    const { membersList, membersGridConfig } = state;

    return getNumberOfFilteredRecords(membersList, membersGridConfig);
  }

  @Selector([SettingsState])
  private static _membersFilterOptions(
    state: SettingsStateModel,
  ): FilterOptions {
    return state.membersFilterOptions;
  }

  @Selector([SettingsState])
  private static _membersFilteringConfig(
    state: SettingsStateModel,
  ): FilteringConfig {
    return state.membersGridConfig.filtering;
  }

  @Selector([SettingsState])
  private static _hasMembersActiveFilters(state: SettingsStateModel): boolean {
    return isAnyFilterActive(state.membersGridConfig.filtering);
  }

  @Selector([SettingsState])
  private static _settingsAdminList(
    state: SettingsStateModel,
  ): SettingsMembersItemModel[] {
    const { adminList, adminGridConfig } = state;

    return applyGridConfig(adminList, adminGridConfig);
  }

  @Selector([SettingsState])
  private static _adminTotalFilteredRecords(state: SettingsStateModel): number {
    const { adminList, adminGridConfig } = state;

    return getNumberOfFilteredRecords(adminList, adminGridConfig);
  }

  @Selector([SettingsState])
  private static _adminFilterOptions(state: SettingsStateModel): FilterOptions {
    return state.adminFilterOptions;
  }

  @Selector([SettingsState])
  private static _adminFilteringConfig(
    state: SettingsStateModel,
  ): FilteringConfig {
    return state.adminGridConfig.filtering;
  }

  @Selector([SettingsState])
  private static _hasAdminActiveFilters(state: SettingsStateModel): boolean {
    return isAnyFilterActive(state.adminGridConfig.filtering);
  }

  @Selector([SettingsState])
  private static _memberRoles(state: SettingsStateModel): string[] {
    return state.memberRoles;
  }

  @Selector([SettingsState])
  private static _isAddMemberFormValid(state: SettingsStateModel): boolean {
    return state.isAddMemberFormValid;
  }

  @Selector([SettingsState])
  private static _companies(state: SettingsStateModel): TreeNode[] {
    return state.companies;
  }

  @Selector([SettingsState])
  private static _services(state: SettingsStateModel): TreeNode[] {
    return state.services;
  }

  @Selector([SettingsState])
  private static _sites(state: SettingsStateModel): TreeNode[] {
    return state.sites;
  }

  @Selector([SettingsState])
  private static _newMemberForm(
    state: SettingsStateModel,
  ): SettingsNewMemberFormModel | null {
    return state.newMemberForm;
  }

  @Selector([SettingsState])
  private static _isServicesDropdownDisabled(
    state: SettingsStateModel,
  ): boolean {
    return state.servicesDropdownDisabled;
  }

  @Selector([SettingsState])
  private static _isSitesDropdownDisabled(state: SettingsStateModel): boolean {
    return state.sitesDropdownDisabled;
  }

  @Selector([SettingsState])
  private static _hasReceivedAdminPermissions(
    state: SettingsStateModel,
  ): boolean {
    return state.hasReceivedAdminPermissions;
  }

  @Selector([SettingsState])
  private static _memberAreasPermissions(
    state: SettingsStateModel,
  ): MemberAreasPermissions[] {
    return structuredClone(state.memberAreasPermissions) || [];
  }

  @Selector([SettingsState])
  private static _hasMemberPermissionsChanged(
    state: SettingsStateModel,
  ): boolean {
    const {
      hasReceivedAdminPermissions,
      selectedCompanyIds,
      selectedServiceIds,
      selectedSiteIds,
    } = state;

    if (
      !hasReceivedAdminPermissions ||
      selectedCompanyIds?.length ||
      selectedServiceIds?.length ||
      selectedSiteIds?.length
    ) {
      return true;
    }

    return false;
  }

  @Selector([SettingsState])
  private static _canMemberInfoBeSubmitted(state: SettingsStateModel): boolean {
    const {
      hasReceivedAdminPermissions,
      selectedCompanyIds,
      selectedServiceIds,
      selectedSiteIds,
      memberAreasPermissions,
    } = state;

    const hasPermissionForArea = (
      area: MemberAreaPermissions,
    ): boolean | undefined => {
      const permission = memberAreasPermissions?.find(
        (p) => p.area === area,
      )?.permission;

      return permission?.view?.isChecked || permission?.edit?.isChecked;
    };

    const hasPermissionsForSchedule = hasPermissionForArea(
      MemberAreaPermissions.Schedules,
    );
    const hasPermissionsForAudits = hasPermissionForArea(
      MemberAreaPermissions.Audits,
    );
    const hasPermissionsForFindings = hasPermissionForArea(
      MemberAreaPermissions.Findings,
    );
    const hasPermissionsForCertificates = hasPermissionForArea(
      MemberAreaPermissions.Certificates,
    );

    const isAdminInfoValid =
      hasReceivedAdminPermissions && !!selectedCompanyIds?.length;

    const isMemberInfoValid =
      !hasReceivedAdminPermissions &&
      !!selectedCompanyIds?.length &&
      !!selectedServiceIds?.length &&
      !!selectedSiteIds?.length &&
      (!!hasPermissionsForSchedule ||
        !!hasPermissionsForAudits ||
        !!hasPermissionsForFindings ||
        !!hasPermissionsForCertificates);

    return isAdminInfoValid || isMemberInfoValid;
  }

  @Selector([SettingsState])
  private static _userDetailsToManagePermission(
    state: SettingsStateModel,
  ): UserDetailsToManagePermission | null {
    return state.userDetailsToManagePermission;
  }

  @Selector([SettingsState])
  private static _isEditManagePermissionsFormPristine(
    state: SettingsStateModel,
  ): boolean {
    return state.isEditManagePermissionsFormPristine;
  }
}
