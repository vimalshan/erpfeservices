import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService, TreeNode } from 'primeng/api';
import { EMPTY, filter, map, Observable, tap } from 'rxjs';

import { DEFAULT_GRID_CONFIG } from '@customer-portal/shared/constants';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import { getFilterOptions } from '@customer-portal/shared/helpers/grid';
import {
  FilterableColumnDefinition,
  Language,
  ToastSeverity,
} from '@customer-portal/shared/models';
import { FilterOptions, GridConfig } from '@customer-portal/shared/models/grid';
import { CoBrowsingCookieService } from '@customer-portal/shared/services/co-browsing';
import { LocaleService } from '@customer-portal/shared/services/locale';

import {
  CoBrowsingCompanyListDto,
  ProfileLanguageDto,
  SettingsAdminListDto,
  SettingsCompanyDetailsCountryListDataDto,
  SettingsCompanyDetailsCountryListDto,
  SettingsMembersListDto,
  SettingsMembersPermissionsDto,
  SettingsMembersRolesDto,
} from '../dtos';
import {
  AccessAreaRoleNames,
  CoBrowsingCompany,
  CreateContactAccessArea,
  CreateContactRequest,
  ManageMembersRequestModel,
  MemberAreaPermissions,
  MemberAreasPermissions,
  ProfileInformationModel,
  ProfileSettingsSelection,
  SelectedUserDetailsModel,
  SettingsCompanyDetailsCountryListData,
  SettingsCompanyDetailsData,
  SettingsMembersItemModel,
  SettingsMembersPermissionsDataModel,
  SettingsNewMemberFormModel,
  UserDetailsToManagePermission,
} from '../models';
import {
  CoBrowsingCompanyListService,
  CoBrowsingMapperService,
  ProfileLanguageMapperService,
  ProfileLanguageService,
  ProfileMapperService,
  ProfileService,
  SettingsAdminListService,
  SettingsCompanyDetailsMapperService,
  SettingsCompanyDetailsService,
  SettingsMembersListService,
  SettingsMembersMapper,
  SettingsMembersPermissionsService,
  SettingsMembersRolesService,
  SettingsUserDetailsToManagePermission,
} from '../services';
import {
  ChangeEditManagePermissionsPristineForm,
  DiscardMemberPermissionsDataAndCompanies,
  DiscardMemberPermissionsUserSelection,
  DiscardNewMemberFormInfo,
  GenerateMemberPermissionsServicesOptions,
  GenerateMemberPermissionsSitesOptions,
  GetCompanyList,
  GetCompanyListSuccess,
  LoadMemberRoles,
  LoadMemberRolesSuccess,
  LoadMembersPermissions,
  LoadMembersPermissionsCompanies,
  LoadMembersPermissionsServices,
  LoadMembersPermissionsSites,
  LoadMembersPermissionsSuccess,
  LoadProfileData,
  LoadProfileLanguage,
  LoadProfileLanguageSuccess,
  LoadSettingsAdminList,
  LoadSettingsAdminListSuccess,
  LoadSettingsCompanyDetails,
  LoadSettingsCompanyDetailsCountryList,
  LoadSettingsCompanyDetailsCountryListSuccess,
  LoadSettingsCompanyDetailsSuccess,
  LoadSettingsMembersList,
  LoadSettingsMembersListSuccess,
  LoadUserDetailsToManagePermission,
  LoadUserRoles,
  LoadUserRolesSuccess,
  RemoveMember,
  RemoveMemberError,
  RemoveMemberSuccess,
  ResetAdminListState,
  ResetCompanyLoadAndErrorState,
  ResetMembersListState,
  ResetProfileLoadAndErrorState,
  ResetSelectedCobrowsingCompany,
  ResetSettingsCompanyDetailsState,
  SaveMemberPermissionsCompanies,
  SaveMemberPermissionsServices,
  SaveMemberPermissionsSites,
  SetCompanyDetailsAdminStatus,
  SetInitialLoginStatus,
  SetProfileLanguage,
  SubmitManageMembersPermissions,
  SubmitManageMembersPermissionsError,
  SubmitManageMembersPermissionsSuccess,
  SubmitNewMemberInfo,
  SubmitNewMemberInfoError,
  SubmitNewMemberInfoSuccess,
  SwitchContinueToPermissionsStatus,
  SwitchHasMemberAdminPermissions,
  SwitchMemberPermissionsServicesDropdownAccess,
  SwitchMemberPermissionsSitesDropdownAccess,
  UpdateAdminFilterOptions,
  UpdateAdminGridConfig,
  UpdateEditCompanyDetailsFormValidity,
  UpdateImpersonatedUser,
  UpdateIsDnvUser,
  UpdateMemberAreasPermissions,
  UpdateMembersFilterOptions,
  UpdateMembersGridConfig,
  UpdateNewMemberForm,
  UpdateProfileLanguage,
  UpdateProfileLanguageSuccess,
  UpdateSelectedCobrowsingCompany,
  UpdateSettingsCompanyDetails,
  UpdateSettingsCompanyDetailsEntityListFilterOptions,
  UpdateSettingsCompanyDetailsEntityListGridConfig,
  UpdateSubmitSettingsStateValues,
  UpdateSubmitSettingsStatus,
  UpdateSubmitSettingsValues,
} from './actions';

interface LoadingErrorState {
  profileData: string | null;
  profileLanguage: string | null;
  companyDetails: string | null;
}

export interface SettingsStateModel {
  isUserAdmin: boolean;
  isInitialLogin: boolean;
  parentCompany: SettingsCompanyDetailsData | null;
  legalEntityList: SettingsCompanyDetailsData[];
  legalEntityListCounter: number;
  legalEntityGridConfig: GridConfig;
  legalEntityFilterOptions: FilterOptions;
  countryList: SettingsCompanyDetailsCountryListData[];
  countryActiveId: number | null;
  adminList: SettingsMembersItemModel[];
  adminGridConfig: GridConfig;
  adminFilterOptions: FilterOptions;
  membersList: SettingsMembersItemModel[];
  membersGridConfig: GridConfig;
  membersFilterOptions: FilterOptions;
  information: ProfileInformationModel;
  userSelection: ProfileSettingsSelection;
  submitSettingsStatus: boolean;
  languageLabel: Language;
  memberRoles: string[];
  userRoles: string[];
  isAddMemberFormValid: boolean;
  newMemberForm: SettingsNewMemberFormModel | null;
  permissionsData: SettingsMembersPermissionsDataModel | null;
  companies: TreeNode[];
  sites: TreeNode[];
  services: TreeNode[];
  hasReceivedAdminPermissions: boolean;
  sitesDropdownDisabled: boolean;
  servicesDropdownDisabled: boolean;
  selectedCompanyIds?: number[];
  selectedServiceIds?: number[];
  selectedSiteIds?: (string | number)[];
  memberAreasPermissions?: MemberAreasPermissions[];
  isEditCompanyDetailsFormValid: boolean;
  userDetailsToManagePermission: UserDetailsToManagePermission | null;
  selectedUserDetails: SelectedUserDetailsModel | null;
  isEditManagePermissionsFormPristine: boolean;
  isDnvUser: boolean;
  adminViewCompanyList: CoBrowsingCompany[];
  selectedCoBrowsingCompany: CoBrowsingCompany | null;
  selectedCoBrowsingCompanyId: string | null;
  loadingErrors: LoadingErrorState;
  loadedStates: {
    profileData: boolean;
    profileLanguage: boolean;
    companyDetails: boolean;
  };
}

const defaultState: SettingsStateModel = {
  isUserAdmin: false,
  isInitialLogin: true,
  parentCompany: null,
  legalEntityList: [],
  legalEntityListCounter: 0,
  legalEntityGridConfig: DEFAULT_GRID_CONFIG,
  legalEntityFilterOptions: {},
  countryList: [],
  countryActiveId: null,
  adminList: [],
  adminGridConfig: DEFAULT_GRID_CONFIG,
  adminFilterOptions: {},
  membersList: [],
  membersGridConfig: DEFAULT_GRID_CONFIG,
  membersFilterOptions: {},
  information: {
    firstName: '',
    lastName: '',
    displayName: '',
    country: '',
    countryCode: '',
    region: '',
    email: '',
    phone: '',
    portalLanguage: '',
    veracityId: '',
    communicationLanguage: 'English',
    jobTitle: '',
    languages: [],
    accessLevel: {},
    sidebarMenu: [],
  },
  userSelection: { communicationLanguage: 'English', jobTitle: '' },
  submitSettingsStatus: false,
  languageLabel: Language.English,
  memberRoles: [],
  userRoles: [],
  isAddMemberFormValid: false,
  newMemberForm: null,
  permissionsData: null,
  companies: [],
  services: [],
  sites: [],
  hasReceivedAdminPermissions: true, // By default admin permissions are granted
  sitesDropdownDisabled: true,
  servicesDropdownDisabled: true,
  isEditCompanyDetailsFormValid: true,
  userDetailsToManagePermission: null,
  selectedUserDetails: null,
  isEditManagePermissionsFormPristine: true,
  isDnvUser: false,
  adminViewCompanyList: [],
  selectedCoBrowsingCompany: null,
  selectedCoBrowsingCompanyId: null,
  loadingErrors: {
    profileData: null,
    profileLanguage: null,
    companyDetails: null,
  },
  loadedStates: {
    profileData: false,
    profileLanguage: false,
    companyDetails: false,
  },
};

const COLUMNS_DEFINITION: FilterableColumnDefinition[] = [
  { field: 'name', hasColumnDelimiter: false },
  { field: 'email', hasColumnDelimiter: false },
  { field: 'company', hasColumnDelimiter: true },
  { field: 'services', hasColumnDelimiter: true },
  { field: 'sites', hasColumnDelimiter: true },
  { field: 'access', hasColumnDelimiter: false },
];

const COMPANY_DETAILS_LEGAL_ENTITIES_COLUMNS_DEFINITION: FilterableColumnDefinition[] =
  [{ field: 'organizationName', hasColumnDelimiter: false }];

@State<SettingsStateModel>({
  name: 'settings',
  defaults: defaultState,
})
@Injectable()
export class SettingsState {
  constructor(
    private readonly profileService: ProfileService,
    private readonly messageService: MessageService,
    private readonly settingsCompanyDetailsService: SettingsCompanyDetailsService,
    private readonly settingsMembersListService: SettingsMembersListService,
    private readonly settingsAdminListService: SettingsAdminListService,
    private readonly localeService: LocaleService,
    private readonly profileLanguageService: ProfileLanguageService,
    private readonly translocoService: TranslocoService,
    private readonly settingsMembersRolesService: SettingsMembersRolesService,
    private readonly settingsMembersPermissionsService: SettingsMembersPermissionsService,
    private readonly settingsUserDetailsToManagePermission: SettingsUserDetailsToManagePermission,
    private readonly coBrowsingCompanyListService: CoBrowsingCompanyListService,
    private readonly coBrowsingCookieService: CoBrowsingCookieService,
  ) {}

  // #region InitialLogin

  @Action(SetInitialLoginStatus)
  setInitialLoginStatus(
    ctx: StateContext<SettingsStateModel>,
    { isInitialLogin }: SetInitialLoginStatus,
  ) {
    ctx.patchState({
      isInitialLogin,
    });
  }

  // #endregion InitialLogin

  // #region SettingsMembers

  @Action(LoadSettingsAdminList)
  loadSettingsAdminList(ctx: StateContext<SettingsStateModel>) {
    const accountDnvId = ctx.getState().selectedCoBrowsingCompanyId;

    return this.settingsAdminListService
      .getSettingsAdminList(accountDnvId)
      .pipe(
        tap((data: SettingsAdminListDto) => {
          if (data.isSuccess) {
            const adminList = SettingsMembersMapper.mapToAdminList(
              data,
              accountDnvId,
            );
            ctx.dispatch(new LoadSettingsAdminListSuccess(adminList));
            ctx.dispatch(new UpdateAdminFilterOptions());
          }
        }),
      );
  }

  @Action(LoadSettingsAdminListSuccess)
  loadSettingsAdminListSuccess(
    ctx: StateContext<SettingsStateModel>,
    { adminList }: LoadSettingsAdminListSuccess,
  ) {
    ctx.patchState({
      adminList,
    });
  }

  @Action(LoadSettingsMembersList)
  loadSettingsMembersList(ctx: StateContext<SettingsStateModel>) {
    const accountDnvId = ctx.getState().selectedCoBrowsingCompanyId;

    return this.settingsMembersListService
      .getSettingsMembersList(accountDnvId)
      .pipe(
        tap((data: SettingsMembersListDto) => {
          if (data.isSuccess) {
            const membersList = SettingsMembersMapper.mapToMembersList(
              data,
              accountDnvId,
            );
            ctx.dispatch(new LoadSettingsMembersListSuccess(membersList));
            ctx.dispatch(new UpdateMembersFilterOptions());
          }
        }),
      );
  }

  @Action(LoadSettingsMembersListSuccess)
  loadSettingsMembersListSuccess(
    ctx: StateContext<SettingsStateModel>,
    { membersList }: LoadSettingsMembersListSuccess,
  ) {
    ctx.patchState({
      membersList,
    });
  }

  @Action(UpdateMembersGridConfig)
  updateMembersGridConfig(
    ctx: StateContext<SettingsStateModel>,
    { membersGridConfig }: UpdateMembersGridConfig,
  ): void {
    ctx.patchState({ membersGridConfig });
    ctx.dispatch(new UpdateMembersFilterOptions());
  }

  @Action(UpdateMembersFilterOptions)
  updateMembersFilterOptions(ctx: StateContext<SettingsStateModel>): void {
    const { membersGridConfig, membersList } = ctx.getState();

    const columnFilterConfigs: FilterableColumnDefinition[] =
      COLUMNS_DEFINITION;

    const filterOptions = getFilterOptions(
      membersList,
      membersGridConfig,
      columnFilterConfigs,
    );

    ctx.patchState({ membersFilterOptions: filterOptions });
  }

  @Action(ResetMembersListState)
  resetMembersListState(ctx: StateContext<SettingsStateModel>): void {
    ctx.patchState({
      adminList: [],
      adminGridConfig: DEFAULT_GRID_CONFIG,
      adminFilterOptions: {},
    });
  }

  @Action(UpdateAdminGridConfig)
  updateAdminGridConfig(
    ctx: StateContext<SettingsStateModel>,
    { adminGridConfig }: UpdateAdminGridConfig,
  ): void {
    ctx.patchState({ adminGridConfig });
    ctx.dispatch(new UpdateAdminFilterOptions());
  }

  @Action(UpdateAdminFilterOptions)
  updateAdminFilterOptions(ctx: StateContext<SettingsStateModel>): void {
    const { adminGridConfig, adminList } = ctx.getState();

    const columnFilterConfigs: FilterableColumnDefinition[] =
      COLUMNS_DEFINITION;

    const filterOptions = getFilterOptions(
      adminList,
      adminGridConfig,
      columnFilterConfigs,
    );

    ctx.patchState({ adminFilterOptions: filterOptions });
  }

  @Action(ResetAdminListState)
  resetAdminListState(ctx: StateContext<SettingsStateModel>): void {
    ctx.patchState({
      adminList: [],
      adminGridConfig: DEFAULT_GRID_CONFIG,
      adminFilterOptions: {},
    });
  }

  @Action(LoadUserDetailsToManagePermission)
  loadUserDetailsToManagePermission(
    ctx: StateContext<SettingsStateModel>,
    { memberEmail }: LoadUserDetailsToManagePermission,
  ) {
    return this.settingsUserDetailsToManagePermission
      .getUserDetailsToManagePermission(memberEmail)
      .pipe(
        tap((data) => {
          const { getUserDetailsTomanagePermission } = data;

          ctx.patchState({
            selectedUserDetails: {
              email: data.emailId,
              firstName: data.firstName,
              lastName: data.lastName,
              jobTitle: data.jobTitle,
            },
          });
          ctx.dispatch(
            new LoadMembersPermissionsSuccess(getUserDetailsTomanagePermission),
          );
        }),
      );
  }

  // #endregion SettingsMembers

  // #region SettingsMembersPermissions

  @Action(LoadMemberRoles)
  LoadMemberRoles(ctx: StateContext<SettingsStateModel>) {
    return this.settingsMembersRolesService.getSettingsMembersRoles().pipe(
      tap((data: SettingsMembersRolesDto) => {
        if (data.isSuccess) {
          ctx.dispatch(new LoadMemberRolesSuccess(data.data));
        }
      }),
    );
  }

  @Action(LoadMemberRolesSuccess)
  LoadMemberRolesSuccess(
    ctx: StateContext<SettingsStateModel>,
    { roles }: LoadMemberRolesSuccess,
  ) {
    ctx.patchState({ memberRoles: roles });
  }

  @Action(SwitchContinueToPermissionsStatus)
  switchContinueToPermissionsStatus(
    ctx: StateContext<SettingsStateModel>,
    { isAddMemberFormValid }: SwitchContinueToPermissionsStatus,
  ) {
    ctx.patchState({
      isAddMemberFormValid,
    });
  }

  @Action(UpdateNewMemberForm)
  updateNewMemberForm(
    ctx: StateContext<SettingsStateModel>,
    { newMemberForm }: UpdateNewMemberForm,
  ) {
    ctx.patchState({
      newMemberForm,
    });
  }

  @Action(LoadMembersPermissions)
  loadMembersPermissions(ctx: StateContext<SettingsStateModel>) {
    const memberEmail = ctx.getState().newMemberForm!.email;
    const accountDnvId = ctx.getState().selectedCoBrowsingCompanyId;

    return this.settingsMembersPermissionsService
      .getSettingsMembersPermissions(memberEmail, accountDnvId)
      .pipe(
        tap((data: SettingsMembersPermissionsDto) => {
          if (data.isSuccess) {
            ctx.dispatch(new LoadMembersPermissionsSuccess(data));
          }
        }),
      );
  }

  @Action(LoadMembersPermissionsSuccess)
  loadMembersPermissionsSuccess(
    ctx: StateContext<SettingsStateModel>,
    { permissionsData }: LoadMembersPermissionsSuccess,
  ) {
    ctx.patchState({ permissionsData });
    const { hasReceivedAdminPermissions } = ctx.getState();
    const companies =
      SettingsMembersMapper.mapToMemberCompanies(permissionsData);

    ctx.dispatch(new LoadMembersPermissionsCompanies(companies));

    ctx.dispatch(
      new UpdateMemberAreasPermissions(
        hasReceivedAdminPermissions
          ? this.getAdminMemberPermissions()
          : this.getMemberPermissions(),
      ),
    );
  }

  @Action(LoadMembersPermissionsCompanies)
  LoadMembersPermissionsCompanies(
    ctx: StateContext<SettingsStateModel>,
    { companies }: LoadMembersPermissionsCompanies,
  ) {
    ctx.patchState({ companies });

    const selectedCompanies = this.getCheckedNodes(companies);

    if (selectedCompanies.length > 0) {
      ctx.dispatch(
        new SaveMemberPermissionsCompanies(
          selectedCompanies.map((c) => c.data),
        ),
      );
    }
  }

  @Action(LoadMembersPermissionsServices)
  LoadMembersPermissionsServices(
    ctx: StateContext<SettingsStateModel>,
    { services }: LoadMembersPermissionsServices,
  ) {
    ctx.patchState({ services });

    const selectedServices = this.getCheckedNodes(services);

    if (selectedServices.length > 0) {
      ctx.dispatch(
        new SaveMemberPermissionsServices(selectedServices.map((c) => c.data)),
      );
    }
  }

  @Action(LoadMembersPermissionsSites)
  loadMembersPermissionsSites(
    ctx: StateContext<SettingsStateModel>,
    { sites }: LoadMembersPermissionsSites,
  ) {
    ctx.patchState({ sites });

    const selectedSites = this.getCheckedNodes(sites);

    if (selectedSites.length > 0) {
      ctx.dispatch(
        new SaveMemberPermissionsSites(selectedSites.map((c) => c.data)),
      );
    }
  }

  @Action(GenerateMemberPermissionsServicesOptions)
  generateMemberPermissionsServicesOptions(
    ctx: StateContext<SettingsStateModel>,
    { selectedCompanyIds }: GenerateMemberPermissionsServicesOptions,
  ) {
    const { hasReceivedAdminPermissions } = ctx.getState();

    if (hasReceivedAdminPermissions) {
      return EMPTY;
    }

    const hasSelectedCompanies = selectedCompanyIds.length > 0;

    ctx.dispatch(
      new SwitchMemberPermissionsServicesDropdownAccess(!hasSelectedCompanies),
    );

    if (!hasSelectedCompanies) {
      return ctx.dispatch([
        new LoadMembersPermissionsServices([]),
        new SaveMemberPermissionsServices([]),
      ]);
    }

    const { selectedServiceIds, permissionsData } = ctx.getState();
    const services = SettingsMembersMapper.mapToMemberServices(
      permissionsData!,
      selectedCompanyIds,
    );

    if (selectedServiceIds?.length) {
      const selectedServiceIdsAfterUpdate = this.selectedIdsAfterUpdate(
        services,
        selectedServiceIds,
      );

      if (selectedServiceIdsAfterUpdate.length !== selectedServiceIds.length) {
        ctx.dispatch(
          new SaveMemberPermissionsServices(
            selectedServiceIdsAfterUpdate as number[],
          ),
        );
      }
    }

    return ctx.dispatch(new LoadMembersPermissionsServices([...services]));
  }

  @Action(GenerateMemberPermissionsSitesOptions)
  generateMemberPermissionsSitesOptions(
    ctx: StateContext<SettingsStateModel>,
    { selectedServiceIds }: GenerateMemberPermissionsSitesOptions,
  ) {
    const hasSelectedServices = selectedServiceIds.length > 0;

    ctx.dispatch(
      new SwitchMemberPermissionsSitesDropdownAccess(!hasSelectedServices),
    );

    if (!hasSelectedServices) {
      return ctx.dispatch([
        new LoadMembersPermissionsSites([]),
        new SaveMemberPermissionsSites([]),
      ]);
    }

    const { selectedSiteIds, permissionsData, selectedCompanyIds } =
      ctx.getState();
    const sites = SettingsMembersMapper.mapToMemberSites(
      permissionsData!,
      selectedServiceIds,
      selectedCompanyIds!,
    );

    if (selectedSiteIds?.length) {
      const selectedSiteIdsAfterUpdate = this.selectedIdsAfterUpdate(
        sites,
        selectedServiceIds,
      );

      if (selectedSiteIdsAfterUpdate.length !== selectedSiteIds.length) {
        ctx.dispatch(
          new SaveMemberPermissionsSites(selectedSiteIdsAfterUpdate),
        );
      }
    }

    return ctx.dispatch(new LoadMembersPermissionsSites([...sites]));
  }

  @Action(SaveMemberPermissionsCompanies)
  saveMemberPermissionsCompanies(
    ctx: StateContext<SettingsStateModel>,
    { selectedCompanyIds }: SaveMemberPermissionsCompanies,
  ) {
    ctx.patchState({ selectedCompanyIds });

    ctx.dispatch(
      new GenerateMemberPermissionsServicesOptions(selectedCompanyIds),
    );
  }

  @Action(SaveMemberPermissionsServices)
  saveMemberPermissionsServices(
    ctx: StateContext<SettingsStateModel>,
    { selectedServiceIds }: SaveMemberPermissionsServices,
  ) {
    ctx.patchState({ selectedServiceIds });

    ctx.dispatch(new GenerateMemberPermissionsSitesOptions(selectedServiceIds));
  }

  @Action(SaveMemberPermissionsSites)
  saveMemberPermissionsSites(
    ctx: StateContext<SettingsStateModel>,
    { selectedSiteIds }: SaveMemberPermissionsSites,
  ) {
    ctx.patchState({ selectedSiteIds: selectedSiteIds || [] });
  }

  @Action(SwitchMemberPermissionsServicesDropdownAccess)
  switchMemberPermissionsServicesDropdownAccess(
    ctx: StateContext<SettingsStateModel>,
    { servicesDropdownDisabled }: SwitchMemberPermissionsServicesDropdownAccess,
  ) {
    ctx.patchState({ servicesDropdownDisabled });
  }

  @Action(SwitchMemberPermissionsSitesDropdownAccess)
  switchMemberPermissionsSitesDropdownAccess(
    ctx: StateContext<SettingsStateModel>,
    { sitesDropdownDisabled }: SwitchMemberPermissionsSitesDropdownAccess,
  ) {
    ctx.patchState({ sitesDropdownDisabled });
  }

  @Action(SwitchHasMemberAdminPermissions)
  switchHasMemberAdminPermissions(
    ctx: StateContext<SettingsStateModel>,
    { hasReceivedAdminPermissions }: SwitchHasMemberAdminPermissions,
  ) {
    ctx.patchState({ hasReceivedAdminPermissions });

    if (hasReceivedAdminPermissions) {
      this.handleAdminPermissions(ctx);
    } else {
      this.handleMemberPermissions(ctx);
    }
  }

  @Action(UpdateMemberAreasPermissions)
  updateMemberAreasPermissions(
    ctx: StateContext<SettingsStateModel>,
    { memberAreasPermissions }: UpdateMemberAreasPermissions,
  ) {
    ctx.patchState({ memberAreasPermissions });
  }

  @Action(DiscardNewMemberFormInfo)
  discardNewMemberFormInfo(ctx: StateContext<SettingsStateModel>) {
    ctx.patchState({
      isAddMemberFormValid: false,
      newMemberForm: null,
    });

    ctx.dispatch(new DiscardMemberPermissionsUserSelection());
  }

  @Action(DiscardMemberPermissionsDataAndCompanies)
  discardMemberPermissionsDataAndCompanies(
    ctx: StateContext<SettingsStateModel>,
  ) {
    ctx.patchState({
      permissionsData: null,
      companies: [],
    });
  }

  @Action(DiscardMemberPermissionsUserSelection)
  discardMemberPermissionsUserSelection(ctx: StateContext<SettingsStateModel>) {
    ctx.patchState({
      sites: [],
      services: [],
      hasReceivedAdminPermissions: true,
      sitesDropdownDisabled: true,
      servicesDropdownDisabled: true,
      selectedCompanyIds: [],
      selectedServiceIds: [],
      selectedSiteIds: [],
      memberAreasPermissions: this.getAdminMemberPermissions(),
    });
  }

  @Action(SubmitNewMemberInfo)
  submitNewMemberInfo(ctx: StateContext<SettingsStateModel>) {
    const newMemberData = this.prepareNewMemberData(ctx.getState());

    return this.settingsMembersPermissionsService
      .createNewMember(newMemberData)
      .pipe(
        tap((response) => {
          if (response.isSuccess) {
            ctx.dispatch(new SubmitNewMemberInfoSuccess());
          } else {
            ctx.dispatch(new SubmitNewMemberInfoError());
          }

          ctx.dispatch(new DiscardNewMemberFormInfo());
          ctx.dispatch(new DiscardMemberPermissionsUserSelection());
          ctx.dispatch(new DiscardMemberPermissionsDataAndCompanies());
        }),
      );
  }

  @Action(SubmitNewMemberInfoSuccess)
  submitNewMemberInfoSuccess(ctx: StateContext<SettingsStateModel>) {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DataSubmitSuccess),
    );
    ctx.dispatch([new LoadSettingsMembersList(), new LoadSettingsAdminList()]);
  }

  @Action(SubmitNewMemberInfoError)
  submitNewMemberInfoError() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.SomethingWentWrong),
    );
  }

  @Action(RemoveMember)
  removeMember(ctx: StateContext<SettingsStateModel>, { email }: RemoveMember) {
    return this.settingsMembersPermissionsService.removeMember(email).pipe(
      tap((response: any) => {
        if (response.isSuccess) {
          return ctx.dispatch(new RemoveMemberSuccess());
        }

        return ctx.dispatch(new RemoveMemberError());
      }),
    );
  }

  @Action(RemoveMemberSuccess)
  removeMemberSuccess(ctx: StateContext<SettingsStateModel>) {
    this.messageService.add(getToastContentBySeverity(ToastSeverity.Success));
    ctx.dispatch([new LoadSettingsMembersList(), new LoadSettingsAdminList()]);
  }

  @Action(RemoveMemberError)
  removeMemberError() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.SomethingWentWrong),
    );
  }

  @Action(SubmitManageMembersPermissions)
  submitManageMembersPermissions(ctx: StateContext<SettingsStateModel>) {
    const memberPermissionsData = this.prepareManangeMembersPermissions(
      ctx.getState(),
    );

    return this.settingsUserDetailsToManagePermission
      .submitManageMembersPermissions(memberPermissionsData)
      .pipe(
        tap((response) => {
          const { managememberpermission } = response;

          if (managememberpermission.isSuccess) {
            ctx.dispatch(new SubmitManageMembersPermissionsSuccess());
          } else {
            ctx.dispatch(new SubmitManageMembersPermissionsError());
          }

          ctx.dispatch([
            new DiscardMemberPermissionsUserSelection(),
            new DiscardMemberPermissionsDataAndCompanies(),
            new LoadSettingsMembersList(),
            new LoadSettingsAdminList(),
          ]);
        }),
      );
  }

  @Action(SubmitManageMembersPermissionsSuccess)
  submitManageMembersPermissionsSuccess() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DataSubmitSuccess),
    );
  }

  @Action(SubmitManageMembersPermissionsError)
  SubmitManageMembersPermissionsError() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.SomethingWentWrong),
    );
  }

  @Action(ChangeEditManagePermissionsPristineForm)
  changeEditManagePermissionsPristineForm(
    ctx: StateContext<SettingsStateModel>,
    { isPristine }: ChangeEditManagePermissionsPristineForm,
  ) {
    ctx.patchState({ isEditManagePermissionsFormPristine: isPristine });
  }

  // #endregion SettingsMembersPermissions

  // #region ProfileSection

  @Action(LoadProfileData)
  loadProfileData(ctx: StateContext<SettingsStateModel>) {
    return this.profileService.getProfileData().pipe(
      map((profileDto) => {
        if (!profileDto || !profileDto.isSuccess) {
          const errorMessage =
            profileDto?.message || 'Failed to load profile data';
          const currentState = ctx.getState();
          ctx.patchState({
            loadingErrors: {
              ...currentState.loadingErrors,
              profileData: errorMessage,
            },
            loadedStates: {
              ...currentState.loadedStates,
              profileData: true,
            },
          });

          return profileDto;
        }

        return profileDto;
      }),
      filter((profileDto) => profileDto?.isSuccess ?? false),
      tap((profileDto) => {
        const currentState = ctx.getState();
        const profileData = ProfileMapperService.mapToProfileItemModel(
          profileDto!,
        );

        ctx.patchState({
          information: profileData?.information,
          loadedStates: {
            ...currentState.loadedStates,
            profileData: true,
          },
          loadingErrors: {
            ...currentState.loadingErrors,
            profileData: null,
          },
        });
      }),
    );
  }

  @Action(UpdateSubmitSettingsStateValues)
  updateSubmitSettingsStateValues(
    ctx: StateContext<SettingsStateModel>,
    { submitSettingsValues }: UpdateSubmitSettingsStateValues,
  ) {
    const state = ctx.getState();

    const communicationLanguage =
      submitSettingsValues?.communicationLanguage?.languageName;
    const jobTitle = submitSettingsValues?.jobTitle;

    const userSelection: ProfileSettingsSelection = {
      ...state.userSelection,
      communicationLanguage,
      jobTitle,
    };

    ctx.patchState({ userSelection });
  }

  @Action(UpdateSubmitSettingsValues)
  updateSubmitSettingsValues(ctx: StateContext<SettingsStateModel>) {
    const state = ctx.getState();

    return this.profileService
      .updateProfileSettingsData(
        state.userSelection?.communicationLanguage,
        state.userSelection?.jobTitle,
      )
      .pipe(
        tap((res: any) => {
          if (res?.data?.updateProfile?.isSuccess) {
            const updatedProfile = res.data.updateProfile.data;
            const { communicationLanguage, jobTitle } = updatedProfile;

            const languages = state.information.languages.map(
              (language: any) => ({
                languageName: language.languageName,
                isSelected: language.languageName === communicationLanguage,
              }),
            );

            const profileInformation: ProfileInformationModel = {
              ...state.information,
              communicationLanguage,
              jobTitle,
              languages,
            };

            ctx.patchState({ information: profileInformation });
          }
        }),
      );
  }

  @Action(UpdateSubmitSettingsStatus)
  updateSubmitSettingsStatus(
    ctx: StateContext<SettingsStateModel>,
    { submitSettingsStatus }: UpdateSubmitSettingsStatus,
  ) {
    ctx.patchState({
      submitSettingsStatus,
    });
  }

  @Action(LoadProfileLanguage)
  loadProfileLanguage(ctx: StateContext<SettingsStateModel>) {
    return this.profileLanguageService.getProfileLanguage().pipe(
      map((profileDto) => {
        if (!profileDto || !profileDto.isSuccess) {
          const currentState = ctx.getState();
          const errorMessage =
            profileDto?.message || 'Failed to load profile language';
          ctx.patchState({
            loadingErrors: {
              ...currentState.loadingErrors,
              profileLanguage: errorMessage,
            },
            loadedStates: {
              ...currentState.loadedStates,
              profileLanguage: true,
            },
          });

          return profileDto;
        }

        return profileDto;
      }),
      filter(
        (profileDto): profileDto is ProfileLanguageDto =>
          !!profileDto && profileDto.isSuccess,
      ),
      tap((dto: ProfileLanguageDto) => {
        const currentState = ctx.getState();
        ctx.dispatch(
          new LoadProfileLanguageSuccess(
            ProfileLanguageMapperService.mapToProfileLanguageModel(dto),
          ),
        );
        ctx.patchState({
          loadedStates: {
            ...currentState.loadedStates,
            profileLanguage: true,
          },
          loadingErrors: {
            ...currentState.loadingErrors,
            profileLanguage: null,
          },
        });
      }),
    );
  }

  @Action(LoadProfileLanguageSuccess)
  loadProfileLanguageSuccess(
    ctx: StateContext<SettingsStateModel>,
    { languageLabel }: LoadProfileLanguageSuccess,
  ) {
    this.localeService.setLocale(languageLabel);
    this.translocoService.setActiveLang(languageLabel);
    ctx.patchState({ languageLabel });
  }

  @Action(SetProfileLanguage)
  setProfileLanguage(
    ctx: StateContext<SettingsStateModel>,
    { languageLabel }: SetProfileLanguage,
  ) {
    this.localeService.setLocale(languageLabel);
    this.translocoService.setActiveLang(languageLabel);
    ctx.patchState({ languageLabel: languageLabel as Language });
  }

  @Action(UpdateProfileLanguage)
  updateProfileLanguage(
    ctx: StateContext<SettingsStateModel>,
    { languageLabel }: UpdateProfileLanguage,
  ) {
    return this.profileLanguageService
      .updateProfileLanguage(languageLabel)
      .pipe(
        tap((dto: ProfileLanguageDto) => {
          if (!dto?.isSuccess) {
            const message = getToastContentBySeverity(ToastSeverity.Error);
            const entityType = this.translocoService.translate('language');
            message.summary = this.translocoService.translate('error.update', {
              entityType,
            });
            this.messageService.add(message);
          } else {
            ctx.dispatch(
              new UpdateProfileLanguageSuccess(
                ProfileLanguageMapperService.mapToProfileLanguageModel(dto),
              ),
            );
          }
        }),
      );
  }

  @Action(UpdateProfileLanguageSuccess)
  updateProfileLanguageSuccess(
    ctx: StateContext<SettingsStateModel>,
    { languageLabel }: UpdateProfileLanguageSuccess,
  ) {
    this.localeService.setLocale(languageLabel);
    ctx.patchState({ languageLabel });
  }

  @Action(LoadUserRoles)
  LoadUserRoles(ctx: StateContext<SettingsStateModel>) {
    return this.settingsMembersRolesService.getSettingsMembersRoles().pipe(
      tap((data: SettingsMembersRolesDto) => {
        if (data.isSuccess) {
          ctx.dispatch(new LoadUserRolesSuccess(data.data));
        }
      }),
    );
  }

  @Action(LoadUserRolesSuccess)
  LoadUserRolesSuccess(
    ctx: StateContext<SettingsStateModel>,
    { roles }: LoadUserRolesSuccess,
  ) {
    ctx.patchState({ userRoles: roles });
  }

  // #endregion ProfileSection
  // #region SettingsCompanyDetails

  @Action(LoadSettingsCompanyDetails)
  loadSettingsCompanyDetails(ctx: StateContext<SettingsStateModel>) {
    return this.settingsCompanyDetailsService.getSettingsCompanyDetails().pipe(
      map((companyDto) => {
        if (!companyDto || !companyDto.isSuccess) {
          const currentState = ctx.getState();
          const errorMessage =
            companyDto?.message || 'Failed to load company data';
          ctx.patchState({
            loadingErrors: {
              ...currentState.loadingErrors,
              companyDetails: errorMessage,
            },
            loadedStates: {
              ...currentState.loadedStates,
              companyDetails: true,
            },
          });

          return companyDto;
        }

        return companyDto;
      }),
      filter((companyDto) => companyDto?.isSuccess ?? false),
      tap((companyDto) => {
        const currentState = ctx.getState();
        ctx.dispatch(
          new LoadSettingsCompanyDetailsSuccess(
            SettingsCompanyDetailsMapperService.mapToSettingsCompanyDetailsModel(
              companyDto?.data ?? {
                isAdmin: false,
                legalEntities: [],
                parentCompany: null,
                userStatus: '',
              },
            ),
          ),
        );
        ctx.dispatch(new UpdateSettingsCompanyDetailsEntityListFilterOptions());
        ctx.patchState({
          loadedStates: {
            ...currentState.loadedStates,
            companyDetails: true,
          },
          loadingErrors: {
            ...currentState.loadingErrors,
            companyDetails: null,
          },
        });
      }),
    );
  }

  @Action(LoadSettingsCompanyDetailsSuccess)
  loadSettingsCompanyDetailsSuccess(
    ctx: StateContext<SettingsStateModel>,
    { companyDetails }: LoadSettingsCompanyDetailsSuccess,
  ) {
    const { isUserAdmin, legalEntityList, parentCompany } = companyDetails;

    ctx.patchState({
      isUserAdmin,
      legalEntityList,
      legalEntityListCounter: legalEntityList.length,
      parentCompany,
    });
  }

  @Action(SetCompanyDetailsAdminStatus)
  setCompanyDetailsAdminStatus(
    ctx: StateContext<SettingsStateModel>,
    { isUserAdmin }: SetCompanyDetailsAdminStatus,
  ) {
    ctx.patchState({
      isUserAdmin,
    });
  }

  @Action(LoadSettingsCompanyDetailsCountryList)
  loadSettingsCompanyDetailsCountryList(ctx: StateContext<SettingsStateModel>) {
    return this.getSettingsCompanyDetailsCountryList().pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadSettingsCompanyDetailsCountryListSuccess(
            SettingsCompanyDetailsMapperService.mapToSettingsCompanyDetailsCountryListModel(
              data,
            ),
          ),
        );
        ctx.dispatch(new UpdateSettingsCompanyDetailsEntityListFilterOptions());
      }),
    );
  }

  @Action(LoadSettingsCompanyDetailsCountryListSuccess)
  loadSettingsCompanyDetailsCountryListSuccess(
    ctx: StateContext<SettingsStateModel>,
    { data }: LoadSettingsCompanyDetailsCountryListSuccess,
  ) {
    const { countryList, countryActiveId } = data;

    ctx.patchState({ countryList, countryActiveId });
  }

  @Action(UpdateSettingsCompanyDetails)
  updateSettingsCompanyDetails(
    ctx: StateContext<SettingsStateModel>,
    { params }: UpdateSettingsCompanyDetails,
  ) {
    return this.editSettingsCompanyDetails(params);
  }

  @Action(UpdateSettingsCompanyDetailsEntityListFilterOptions)
  updateSettingsCompanyDetailsEntityListFilterOptions(
    ctx: StateContext<SettingsStateModel>,
  ) {
    const { legalEntityList, legalEntityGridConfig } = ctx.getState();

    const legalEntityFilterOptions = getFilterOptions(
      legalEntityList,
      legalEntityGridConfig,
      COMPANY_DETAILS_LEGAL_ENTITIES_COLUMNS_DEFINITION,
    );

    ctx.patchState({ legalEntityFilterOptions });
  }

  @Action(UpdateSettingsCompanyDetailsEntityListGridConfig)
  updateSettingsCompanyDetailsEntityListGridConfig(
    ctx: StateContext<SettingsStateModel>,
    { legalEntityGridConfig }: UpdateSettingsCompanyDetailsEntityListGridConfig,
  ) {
    ctx.patchState({ legalEntityGridConfig });
    ctx.dispatch(new UpdateSettingsCompanyDetailsEntityListFilterOptions());
  }

  @Action(ResetSettingsCompanyDetailsState)
  resetSettingsCompanyDetailsState(
    ctx: StateContext<SettingsStateModel>,
  ): void {
    ctx.patchState({
      legalEntityList: [],
      legalEntityGridConfig: DEFAULT_GRID_CONFIG,
      legalEntityFilterOptions: {},
    });
  }

  @Action(UpdateEditCompanyDetailsFormValidity)
  updateEditCompanyDetailsFormValidity(
    ctx: StateContext<SettingsStateModel>,
    { isEditCompanyDetailsFormValid }: UpdateEditCompanyDetailsFormValidity,
  ) {
    ctx.patchState({
      isEditCompanyDetailsFormValid,
    });
  }

  // #endregion SettingsCompanyDetails

  // #region AdminCoBrowsing

  @Action(UpdateIsDnvUser)
  switchIsDnvUser(
    ctx: StateContext<SettingsStateModel>,
    { isDnvUser }: UpdateIsDnvUser,
  ) {
    ctx.patchState({
      isDnvUser,
    });
  }

  @Action(GetCompanyList)
  getCompanyList(ctx: StateContext<SettingsStateModel>) {
    return this.coBrowsingCompanyListService.getCompanyList().pipe(
      tap((data: CoBrowsingCompanyListDto) => {
        if (data.isSuccess) {
          ctx.dispatch(
            new GetCompanyListSuccess(
              CoBrowsingMapperService.mapToCoBrowsingCompanyList(data.data),
            ),
          );
        }
      }),
    );
  }

  @Action(GetCompanyListSuccess)
  getCompanyListSuccess(
    ctx: StateContext<SettingsStateModel>,
    { companyList }: GetCompanyListSuccess,
  ) {
    ctx.patchState({
      adminViewCompanyList: companyList,
    });
  }

  @Action(UpdateSelectedCobrowsingCompany)
  updateSelectedCobrowsingCompany(
    ctx: StateContext<SettingsStateModel>,
    { selectedCompany }: UpdateSelectedCobrowsingCompany,
  ) {
    ctx.patchState({
      selectedCoBrowsingCompany: selectedCompany,
      selectedCoBrowsingCompanyId: selectedCompany?.id || null,
    });
  }

  @Action(ResetSelectedCobrowsingCompany)
  resetSelectedCobrowsingCompany(ctx: StateContext<SettingsStateModel>) {
    ctx.patchState({
      selectedCoBrowsingCompany: null,
      selectedCoBrowsingCompanyId: null,
    });
  }

  @Action(ResetProfileLoadAndErrorState)
  resetProfileLoadAndErrorState(ctx: StateContext<SettingsStateModel>): void {
    ctx.patchState({
      loadedStates: {
        ...ctx.getState().loadedStates,
        profileData: false,
        profileLanguage: false,
      },
      loadingErrors: {
        ...ctx.getState().loadingErrors,
        profileData: null,
        profileLanguage: null,
      },
      information: {
        firstName: '',
        lastName: '',
        displayName: '',
        country: '',
        countryCode: '',
        region: '',
        email: '',
        phone: '',
        portalLanguage: '',
        veracityId: '',
        communicationLanguage: 'English',
        jobTitle: '',
        languages: [],
        accessLevel: {},
        sidebarMenu: [],
      },
      languageLabel: Language.English,
    });
  }

  @Action(ResetCompanyLoadAndErrorState)
  resetCompanyLoadAndErrorState(ctx: StateContext<SettingsStateModel>): void {
    ctx.patchState({
      loadedStates: {
        ...ctx.getState().loadedStates,
        companyDetails: false,
      },
      loadingErrors: {
        ...ctx.getState().loadingErrors,
        companyDetails: null,
      },
      isUserAdmin: false,
      legalEntityList: [],
      legalEntityListCounter: 0,
      parentCompany: null,
    });
  }

  @Action(UpdateImpersonatedUser)
  updateImpersonatedUser(
    ctx: StateContext<SettingsStateModel>,
    { impersonatedUserEmail }: UpdateImpersonatedUser,
  ) {
    return this.coBrowsingCookieService.postUserEmailCookie(
      impersonatedUserEmail,
    );
  }

  // #endregion AdminCoBrowsing

  // #region Helper methods

  private getSettingsCompanyDetailsCountryList(): Observable<
    SettingsCompanyDetailsCountryListDataDto[]
  > {
    return this.settingsCompanyDetailsService
      .getSettingsCompanyDetailsCountryList()
      .pipe(
        map((dto: SettingsCompanyDetailsCountryListDto) =>
          dto?.isSuccess && dto?.data
            ? dto.data
            : ([] as SettingsCompanyDetailsCountryListDataDto[]),
        ),
      );
  }

  private editSettingsCompanyDetails(params: any) {
    return this.settingsCompanyDetailsService.editSettingsCompanyDetails({
      ...params,
    });
  }

  private handleAdminPermissions(ctx: StateContext<SettingsStateModel>): void {
    ctx.dispatch([
      new LoadMembersPermissionsServices([]),
      new SwitchMemberPermissionsServicesDropdownAccess(true),
      new SaveMemberPermissionsServices([]),
      new SaveMemberPermissionsSites([]),
      new UpdateMemberAreasPermissions(this.getAdminMemberPermissions()),
    ]);
  }

  private handleMemberPermissions(ctx: StateContext<SettingsStateModel>): void {
    ctx.dispatch(new UpdateMemberAreasPermissions(this.getMemberPermissions()));

    const { selectedCompanyIds, selectedServiceIds } = ctx.getState();

    if (selectedCompanyIds?.length) {
      ctx.dispatch(
        new GenerateMemberPermissionsServicesOptions(selectedCompanyIds),
      );
    }

    if (selectedServiceIds?.length) {
      ctx.dispatch(new SwitchMemberPermissionsSitesDropdownAccess(false));
    }
  }

  private getAdminMemberPermissions(): MemberAreasPermissions[] {
    return [
      {
        area: MemberAreaPermissions.Contracts,
        permission: {
          view: {
            isChecked: true,
            roleId: 1,
            roleName: AccessAreaRoleNames.CONTRACTS_VIEW,
          },
          edit: undefined,
          submit: undefined,
        },
      },
      {
        area: MemberAreaPermissions.Schedules,
        permission: {
          view: {
            isChecked: true,
            roleId: 2,
            roleName: AccessAreaRoleNames.SCHEDULE_VIEW,
          },
          edit: {
            isChecked: true,
            roleId: 3,
            roleName: AccessAreaRoleNames.SCHEDULE_EDIT,
          },
        },
      },
      {
        area: MemberAreaPermissions.Audits,
        permission: {
          view: {
            isChecked: true,
            roleId: 8,
            roleName: AccessAreaRoleNames.AUDITS_VIEW,
          },
          edit: {
            isChecked: true,
            roleId: 9,
            roleName: AccessAreaRoleNames.AUDITS_EDIT,
          },
        },
      },
      {
        area: MemberAreaPermissions.Findings,
        permission: {
          view: {
            isChecked: true,
            roleId: 10,
            roleName: AccessAreaRoleNames.FINDINGS_VIEW,
          },
          edit: {
            isChecked: true,
            roleId: 11,
            roleName: AccessAreaRoleNames.FINDINGS_EDIT,
          },
          submit: {
            isChecked: true,
            roleId: 12,
            roleName: AccessAreaRoleNames.FINDINGS_SUBMIT,
          },
        },
      },
      {
        area: MemberAreaPermissions.Certificates,
        permission: {
          view: {
            isChecked: true,
            roleId: 4,
            roleName: AccessAreaRoleNames.CERTIFICATES_VIEW,
          },
          edit: {
            isChecked: true,
            roleId: 5,
            roleName: AccessAreaRoleNames.CERTIFICATES_EDIT,
          },
        },
      },
      {
        area: MemberAreaPermissions.Financials,
        permission: {
          view: undefined,
          edit: {
            isChecked: true,
            roleId: 6,
            roleName: AccessAreaRoleNames.FINANCIALS_EDIT,
          },
        },
      },
    ];
  }

  private getMemberPermissions(): MemberAreasPermissions[] {
    return [
      {
        area: MemberAreaPermissions.Contracts,
        permission: {
          view: {
            isChecked: false,
            roleId: 1,
            roleName: 'Contracts_View',
          },
          edit: undefined,
        },
      },
      {
        area: MemberAreaPermissions.Schedules,
        permission: {
          view: {
            isChecked: true,
            roleId: 2,
            roleName: AccessAreaRoleNames.SCHEDULE_VIEW,
          },
          edit: {
            isChecked: false,
            roleId: 3,
            roleName: AccessAreaRoleNames.SCHEDULE_EDIT,
          },
        },
      },
      {
        area: MemberAreaPermissions.Audits,
        permission: {
          view: {
            isChecked: true,
            roleId: 8,
            roleName: AccessAreaRoleNames.AUDITS_VIEW,
          },
          edit: {
            isChecked: false,
            roleId: 9,
            roleName: AccessAreaRoleNames.AUDITS_EDIT,
          },
        },
      },
      {
        area: MemberAreaPermissions.Findings,
        permission: {
          view: {
            isChecked: true,
            roleId: 10,
            roleName: AccessAreaRoleNames.FINDINGS_VIEW,
          },
          edit: {
            isChecked: false,
            roleId: 11,
            roleName: AccessAreaRoleNames.FINDINGS_EDIT,
          },
          submit: {
            isChecked: false,
            roleId: 12,
            roleName: AccessAreaRoleNames.FINDINGS_SUBMIT,
          },
        },
      },
      {
        area: MemberAreaPermissions.Certificates,
        permission: {
          view: {
            isChecked: true,
            roleId: 4,
            roleName: 'Certificates_View',
          },
          edit: {
            isChecked: false,
            roleId: 5,
            roleName: 'Certificates_Edit',
          },
        },
      },
      {
        area: MemberAreaPermissions.Financials,
        permission: {
          view: undefined,
          edit: {
            isChecked: false,
            roleId: 6,
            roleName: 'Financials_Edit',
          },
        },
      },
    ];
  }

  private prepareNewMemberData(
    state: SettingsStateModel,
  ): CreateContactRequest {
    const {
      permissionsData,
      newMemberForm,
      hasReceivedAdminPermissions,
      selectedCompanyIds,
      selectedServiceIds,
      selectedSiteIds,
      memberAreasPermissions,
    } = state;

    const accessAreas = this.getAccessAreas(memberAreasPermissions);

    let newMemberData: CreateContactRequest = {
      email: newMemberForm!.email,
      firstName: newMemberForm!.firstName,
      lastName: newMemberForm!.lastName,
      communicationLanguage: '',
      phone: '',
      countryId: 0,
      jobTitle: newMemberForm!.role,
      isAdmin: hasReceivedAdminPermissions ? 1 : 0,
      accessAreas,
      companies: SettingsMembersMapper.mapToSelectedCompanies(
        permissionsData!,
        selectedCompanyIds!,
      ),
      services: [] as any,
      countries: [] as any,
    };

    if (!hasReceivedAdminPermissions) {
      newMemberData = {
        ...newMemberData,
        services: SettingsMembersMapper.mapToSelectedServices(
          permissionsData!,
          selectedServiceIds!,
        ),
        countries: SettingsMembersMapper.mapToSelectedSites(
          permissionsData!,
          selectedSiteIds!,
        ),
      };
    }

    return newMemberData;
  }

  private prepareManangeMembersPermissions(
    state: SettingsStateModel,
  ): ManageMembersRequestModel {
    const {
      permissionsData,
      hasReceivedAdminPermissions,
      selectedCompanyIds,
      selectedServiceIds,
      selectedSiteIds,
      memberAreasPermissions,
    } = state;

    const accessAreas = this.getAccessAreas(memberAreasPermissions);
    let manageMemberPermissionsData: ManageMembersRequestModel = {
      userId: permissionsData?.data[0]?.userId || 0,
      email: permissionsData?.data[0]?.emailId || '',
      isAdmin: hasReceivedAdminPermissions ? 1 : 0,
      accessAreas,
      companies: SettingsMembersMapper.mapToSelectedCompanies(
        permissionsData!,
        selectedCompanyIds!,
      ),
      services: [],
      countries: [],
    };

    if (!hasReceivedAdminPermissions) {
      manageMemberPermissionsData = {
        ...manageMemberPermissionsData,
        services: SettingsMembersMapper.mapToSelectedServices(
          permissionsData!,
          selectedServiceIds!,
        ),
        countries: SettingsMembersMapper.mapToSelectedSites(
          permissionsData!,
          selectedSiteIds!,
        ),
      };
    }

    return manageMemberPermissionsData;
  }

  private getAccessAreas(
    memberAreasPermissions: MemberAreasPermissions[] | undefined,
  ): CreateContactAccessArea[] {
    if (!memberAreasPermissions) {
      return [];
    }

    return memberAreasPermissions.reduce(
      (acc: CreateContactAccessArea[], { permission }) => {
        if (permission.view?.isChecked) {
          acc.push({
            roleId: permission.view.roleId,
            roleName: permission.view.roleName,
          });
        }

        if (permission.edit?.isChecked) {
          acc.push({
            roleId: permission.edit.roleId,
            roleName: permission.edit.roleName,
          });
        }

        if (permission.submit?.isChecked) {
          acc.push({
            roleId: permission.submit.roleId,
            roleName: permission.submit.roleName,
          });
        }

        return acc;
      },
      [],
    );
  }

  private selectedIdsAfterUpdate(
    treeStructure: TreeNode[],
    selectedIds: (string | number)[],
  ): (string | number)[] {
    let selectedSiteIds: (string | number)[] = [];

    treeStructure.forEach((element) => {
      if (selectedIds.includes(element.data)) {
        selectedSiteIds.push(element.data);
      }

      if (element.children) {
        selectedSiteIds = selectedSiteIds.concat(
          this.selectedIdsAfterUpdate(element.children, selectedIds),
        );
      }
    });

    return selectedSiteIds;
  }

  private getCheckedNodes(nodes: TreeNode[]): TreeNode[] {
    const checkedNodes: TreeNode[] = [];

    nodes.forEach((node) => {
      if (node.checked) {
        checkedNodes.push(node);
      }

      if (node.children && node.children.length > 0) {
        checkedNodes.push(...this.getCheckedNodes(node.children));
      }
    });

    return checkedNodes;
  }

  // #endregion Helper methods
}
