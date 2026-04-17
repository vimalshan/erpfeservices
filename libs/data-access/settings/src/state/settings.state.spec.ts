import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { NgxsModule, Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { isEmpty, of } from 'rxjs';

import {
  createMessageServiceMock,
  Language,
  LocaleService,
} from '@customer-portal/shared';

import { SettingsMembersPermissionsDto } from '../dtos';
import {
  CoBrowsingCompanyListService,
  ProfileLanguageMapperService,
  ProfileLanguageService,
  ProfileService,
  SettingsAdminListService,
  SettingsCompanyDetailsService,
  SettingsMembersListService,
  SettingsMembersMapper,
  SettingsMembersPermissionsService,
  SettingsMembersRolesService,
  SettingsUserDetailsToManagePermission,
} from '../services';
import {
  GenerateMemberPermissionsServicesOptions,
  LoadMemberRoles,
  LoadMemberRolesSuccess,
  LoadMembersPermissions,
  LoadProfileData,
  LoadProfileLanguage,
  ResetSelectedCobrowsingCompany,
  SaveMemberPermissionsCompanies,
  SetInitialLoginStatus,
  SwitchContinueToPermissionsStatus,
  UpdateNewMemberForm,
  UpdateProfileLanguage,
  UpdateSubmitSettingsStateValues,
  UpdateSubmitSettingsStatus,
  UpdateSubmitSettingsValues,
} from './actions';
import { SettingsState } from './settings.state';

const MEMBER_PERMISSIONS_DTO: SettingsMembersPermissionsDto = {
  data: [
    {
      companies: [
        {
          companyId: 1,
          companyName: 'FONDERIE MORA GAVARDO S.p.A.',
          isCompanySelected: false,
          hasParentId: false,
          parentId: 0,
          services: [
            {
              countries: [
                {
                  cities: [
                    {
                      cityName: 'Antwerp',
                      sites: [
                        {
                          siteId: 1,
                          siteName: 'Site 1',
                        },
                      ],
                    },
                  ],
                  countryId: 1,
                  countryName: 'Finland',
                },
                {
                  cities: [
                    {
                      cityName: 'Antwerp',
                      sites: [
                        {
                          siteId: 2,
                          siteName: 'Site 2',
                        },
                      ],
                    },
                  ],
                  countryId: 1,
                  countryName: 'Spain',
                },
              ],
              serviceId: 1,
              serviceName: 'ISO 14001:2015',
              isServiceSelected: false,
            },
          ],
        },
        {
          companyId: 13,
          isCompanySelected: false,
          companyName: 'Kuehne-Nagel Management AG',
          hasParentId: false,
          parentId: 0,
          services: [
            {
              countries: [
                {
                  cities: [
                    {
                      cityName: 'Schindellegi',
                      sites: [
                        {
                          siteId: 7,
                          siteName: 'Kühne + Nagel Management AG',
                        },
                      ],
                    },
                    {
                      cityName: 'Möhlin',
                      sites: [
                        {
                          siteId: 13,
                          siteName: 'Kühne + Nagel Aktiengesellschaft',
                        },
                      ],
                    },
                  ],
                  countryId: 452,
                  countryName: 'Switzerland',
                },
                {
                  cities: [
                    {
                      cityName: 'Dubai',
                      sites: [
                        {
                          siteId: 15,
                          siteName: 'Kuehne + Nagel L.L.C.',
                        },
                      ],
                    },
                  ],
                  countryId: 468,
                  countryName: 'United Arab Emirates',
                },
                {
                  cities: [
                    {
                      cityName: 'Zwolle',
                      sites: [
                        {
                          siteId: 16,
                          siteName: 'Kuehne + Nagel Logistics B.V. ',
                        },
                      ],
                    },
                    {
                      cityName: 'Westzaan',
                      sites: [
                        {
                          siteId: 17,
                          siteName: 'Kuehne + Nagel Logistics B.V. ',
                        },
                      ],
                    },
                    {
                      cityName: 'Delfgauw',
                      sites: [
                        {
                          siteId: 18,
                          siteName: 'Kuehne + Nagel Logistics B.V. ',
                        },
                      ],
                    },
                    {
                      cityName: 'Tilburg',
                      sites: [
                        {
                          siteId: 19,
                          siteName: 'Kuehne + Nagel Logistics B.V. ',
                        },
                      ],
                    },
                  ],
                  countryId: 397,
                  countryName: 'Netherlands',
                },
              ],
              serviceId: 1475,
              serviceName: 'HACCP',
              isServiceSelected: false,
            },
          ],
        },
      ],
      userId: 2150,
      jobTitle: '',
      emailId: '',
      firstName: '',
      lastName: '',
    },
  ],
  errorCode: '',
  isSuccess: true,
  message: 'User permissions retrieved successfully.',
};

describe('SettingsState', () => {
  let store: Store;

  const profileServiceMock = {
    getProfileData: jest.fn(),
    updateProfileSettingsData: jest.fn(),
  };

  const profileLanguageServiceMock = {
    getProfileLanguage: jest.fn(),
    updateProfileLanguage: jest.fn(),
  };
  const localeServiceMock = {
    setLocale: jest.fn(),
  };

  const translocoServiceMock = {
    setActiveLang: jest.fn(),
  };
  const profileLanguageMapperServiceMock = {
    mapToProfileLanguageModel: jest.fn(),
  };

  const settingsMembersPermissionsServiceMock = {
    getSettingsMembersPermissions: jest.fn(),
  } as Partial<jest.Mocked<SettingsMembersPermissionsService>>;

  const settingsUserDetailsToManagePermission = {
    getUserDetailsToManagePermission: jest.fn(),
  };

  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();

  const settingsMembersRolesServiceMock = {
    getSettingsMembersRoles: jest.fn(),
  } as Partial<jest.Mocked<SettingsMembersRolesService>>;

  const coBrowsingCompanyListServiceMock = {
    getCompanyList: jest.fn(),
  } as Partial<jest.Mocked<CoBrowsingCompanyListService>>;

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SettingsState])],
      providers: [
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
        {
          provide: ProfileService,
          useValue: profileServiceMock,
        },
        {
          provide: ProfileLanguageService,
          useValue: profileLanguageServiceMock,
        },

        {
          provide: LocaleService,
          useValue: localeServiceMock,
        },
        {
          provide: TranslocoService,
          useValue: translocoServiceMock,
        },
        {
          provide: ProfileLanguageMapperService,
          useValue: profileLanguageMapperServiceMock,
        },
        {
          provide: SettingsCompanyDetailsService,
          useValue: {},
        },
        {
          provide: SettingsMembersListService,
          useValue: {},
        },
        {
          provide: SettingsAdminListService,
          useValue: {},
        },
        {
          provide: SettingsMembersRolesService,
          useValue: settingsMembersRolesServiceMock,
        },
        {
          provide: SettingsMembersPermissionsService,
          useValue: settingsMembersPermissionsServiceMock,
        },
        {
          provide: SettingsUserDetailsToManagePermission,
          useValue: settingsUserDetailsToManagePermission,
        },
        {
          provide: CoBrowsingCompanyListService,
          useValue: coBrowsingCompanyListServiceMock,
        },
        {
          provide: HttpClient,
          useValue: {},
        },
      ],
    });
    store = TestBed.inject(Store);
  });

  test('should update initial login status in the state', () => {
    // Arrange
    const expectedLoginStatus = false;

    // Act
    store.dispatch(new SetInitialLoginStatus(expectedLoginStatus));
    const actualLoginStatus = store.selectSnapshot(
      (state) => state.settings.isInitialLogin,
    );

    // Assert
    expect(actualLoginStatus).toEqual(expectedLoginStatus);
  });

  test('should request load profile data and store it into the state', () => {
    // Arrange
    const mockedGetProfileResponse = {
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
    };

    jest
      .spyOn(profileServiceMock, 'getProfileData')
      .mockReturnValueOnce(of(mockedGetProfileResponse));

    // Act
    store.dispatch(new LoadProfileData());

    const actualProfileDataInState = store.selectSnapshot(
      (state) => state.settings,
    );

    // Assert
    expect(actualProfileDataInState.information).toEqual(
      mockedGetProfileResponse.information,
    );
  });

  test('should get profile language', () => {
    // Arrange
    const mockedGetProfileLanguageResponse = {
      isSuccess: true,
      data: {
        portalLanguage: 'en',
      },
    };

    jest
      .spyOn(profileLanguageServiceMock, 'getProfileLanguage')
      .mockReturnValueOnce(of(mockedGetProfileLanguageResponse));

    // Act
    store.dispatch(new LoadProfileLanguage());

    const actualProfileLanguageDataInState = store.selectSnapshot(
      (state) => state?.settings?.languageLabel,
    );

    // Assert
    expect(actualProfileLanguageDataInState).toEqual(
      mockedGetProfileLanguageResponse?.data?.portalLanguage,
    );
  });

  test('should update profile language AND update into the state', () => {
    // Arrange
    const mockedUpdatedProfileLanguageResponse = {
      information: {},
      submitSettingsStatus: true,
      languageLabel: 'en',
    };

    jest
      .spyOn(profileLanguageServiceMock, 'updateProfileLanguage')
      .mockReturnValueOnce(of(mockedUpdatedProfileLanguageResponse));

    const languageLabel = Language;
    // Act
    store.dispatch(new UpdateProfileLanguage(languageLabel.English));

    const actualUpdatedProfileLanguageDataInState = store.selectSnapshot(
      (state) => state?.settings?.languageLabel,
    );

    // Assert
    expect(actualUpdatedProfileLanguageDataInState).toEqual(
      mockedUpdatedProfileLanguageResponse?.languageLabel,
    );
  });

  test('should update profile language SUCCESS AND update into the state', () => {
    // Arrange
    const mockedUpdatedProfileLanguageSuccessResponse = {
      information: {},
      submitSettingsStatus: true,
      languageLabel: 'en',
    };

    jest
      .spyOn(profileLanguageServiceMock, 'updateProfileLanguage')
      .mockReturnValueOnce(of(mockedUpdatedProfileLanguageSuccessResponse));

    const languageLabel = Language;
    // Act
    store.dispatch(new UpdateProfileLanguage(languageLabel.English));

    const actualUpdatedProfileLanguageDataInState = store.selectSnapshot(
      (state) => state?.settings?.languageLabel,
    );

    // Assert
    expect(actualUpdatedProfileLanguageDataInState).toEqual(
      mockedUpdatedProfileLanguageSuccessResponse?.languageLabel,
    );
  });

  test('should update submit setting status AND update into the state', () => {
    // Arrange
    const mockedUpdatedSettigsStatusResponse = {
      information: {},
      submitSettingsStatus: true,
      languageLabel: 'en',
    };

    jest
      .spyOn(profileLanguageServiceMock, 'updateProfileLanguage')
      .mockReturnValueOnce(of(mockedUpdatedSettigsStatusResponse));

    // Act
    store.dispatch(new UpdateSubmitSettingsStatus(true));

    const actualUpdatedProfileLanguageDataInState = store.selectSnapshot(
      (state) => state?.settings?.submitSettingsStatus,
    );

    // Assert
    expect(actualUpdatedProfileLanguageDataInState).toEqual(
      mockedUpdatedSettigsStatusResponse?.submitSettingsStatus,
    );
  });

  test('should update submit setting values', () => {
    // Arrange
    const mockedUpdatedSettigsValuesResponse = {
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
      submitSettingsStatus: true,
      languageLabel: 'en',
    };

    jest
      .spyOn(profileServiceMock, 'updateProfileSettingsData')
      .mockReturnValueOnce(of(mockedUpdatedSettigsValuesResponse));

    // Act
    store.dispatch(new UpdateSubmitSettingsValues());

    const actualSubmitSettingValuesResponse = store.selectSnapshot(
      (state) => state.settings.information,
    );

    // Assert
    expect(actualSubmitSettingValuesResponse).toEqual(
      mockedUpdatedSettigsValuesResponse.information,
    );
  });

  test('should update submit setting state values', () => {
    // Arrange
    const mockedUpdatedSettigsStateValuesResponse = {
      information: {},
      submitSettingsStatus: true,
      languageLabel: 'en',
      userSelection: {
        communicationLanguage: undefined,
        jobTitle: '',
      },
    };

    jest
      .spyOn(profileLanguageServiceMock, 'updateProfileLanguage')
      .mockReturnValueOnce(of(mockedUpdatedSettigsStateValuesResponse));

    const settingvalue = {
      communicationLanguage: '',
      jobTitle: '',
    };

    // Act
    store.dispatch(new UpdateSubmitSettingsStateValues(settingvalue));

    const actualUpdateSubmitSettingstateValues = store.selectSnapshot(
      (state) => state.settings.userSelection,
    );

    // Assert
    expect(actualUpdateSubmitSettingstateValues).toEqual(
      mockedUpdatedSettigsStateValuesResponse.userSelection,
    );
  });

  describe('settings members', () => {
    beforeEach(() => {
      const permissionsDataDto: SettingsMembersPermissionsDto =
        MEMBER_PERMISSIONS_DTO;
      const memberEmail = 'test@example.com';
      store.reset({
        settings: {
          ...store.snapshot().settings,
          newMemberForm: { email: memberEmail },
          hasReceivedAdminPermissions: false,
        },
      });
      settingsMembersPermissionsServiceMock.getSettingsMembersPermissions!.mockReturnValue(
        of(permissionsDataDto),
      );
    });

    test('should load member roles successfully', () => {
      // Arrange
      const response = { isSuccess: true, data: ['role1', 'role2'] };
      settingsMembersRolesServiceMock.getSettingsMembersRoles!.mockReturnValue(
        of(response),
      );

      // Act
      store.dispatch(new LoadMemberRoles());

      const actualRoles = store.selectSnapshot(
        (state) => state.settings.memberRoles,
      );

      // Assert
      expect(
        settingsMembersRolesServiceMock.getSettingsMembersRoles,
      ).toHaveBeenCalled();
      expect(actualRoles).toEqual(response.data);
    });

    test('should handle load member roles success', () => {
      // Arrange
      const roles = ['role1', 'role2'];
      const action = new LoadMemberRolesSuccess(roles);

      // Act
      store.dispatch(action);

      const actualRoles = store.selectSnapshot(
        (state) => state.settings.memberRoles,
      );

      // Assert
      expect(actualRoles).toEqual(roles);
    });

    test('should switch continue to permissions status', () => {
      // Arrange
      const isAddMemberFormValid = true;
      const action = new SwitchContinueToPermissionsStatus(
        isAddMemberFormValid,
      );

      // Act
      store.dispatch(action);

      const actualStatus = store.selectSnapshot(
        (state) => state.settings.isAddMemberFormValid,
      );

      // Assert
      expect(actualStatus).toEqual(isAddMemberFormValid);
    });

    test('should update new member form', () => {
      // Arrange
      const newMemberForm = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Admin',
      };
      const action = new UpdateNewMemberForm(newMemberForm);

      // Act
      store.dispatch(action);

      const actualForm = store.selectSnapshot(
        (state) => state.settings.newMemberForm,
      );

      // Assert
      expect(actualForm).toEqual(newMemberForm);
    });

    test('should load members permissions and trigger members permissions success and load comanies', () => {
      // Arrange
      const permissionsDataDto: SettingsMembersPermissionsDto =
        MEMBER_PERMISSIONS_DTO;
      const memberEmail = 'test@example.com';

      // Act
      store.dispatch(new LoadMembersPermissions());

      const actualPermissionsData = store.selectSnapshot(
        (state) => state.settings.permissionsData,
      );

      const actualCompanies = store.selectSnapshot(
        (state) => state.settings.companies,
      );

      // Assert
      expect(
        settingsMembersPermissionsServiceMock.getSettingsMembersPermissions,
      ).toHaveBeenCalledWith(memberEmail, null);

      expect(actualPermissionsData).toEqual(permissionsDataDto);
      expect(actualCompanies).toEqual(
        SettingsMembersMapper.mapToMemberCompanies(permissionsDataDto),
      );
    });

    test('should not load members permissions when query is not successful', () => {
      // Arrange
      const response = { isSuccess: false, data: {} };
      const memberEmail = 'test@example.com';
      store.reset({
        settings: {
          ...store.snapshot().settings,
          newMemberForm: { email: memberEmail },
        },
      });
      settingsMembersPermissionsServiceMock.getSettingsMembersPermissions!.mockReturnValue(
        of(response),
      );

      // Act
      store.dispatch(new LoadMembersPermissions());

      const actualPermissionsData = store.selectSnapshot(
        (state) => state.settings.permissionsData,
      );

      const actualCompanies = store.selectSnapshot(
        (state) => state.settings.companies,
      );

      // Assert
      expect(
        settingsMembersPermissionsServiceMock.getSettingsMembersPermissions,
      ).toHaveBeenCalledWith(memberEmail, null);
      expect(actualPermissionsData).toEqual(null);
      expect(actualCompanies).toEqual([]);
    });

    test('should handle load members permissions services if no admin permissions received', () => {
      // Act
      store.dispatch(new LoadMembersPermissions());
      store.dispatch(new SaveMemberPermissionsCompanies([1]));

      const actualServices = store.selectSnapshot(
        (state) => state.settings.services,
      );

      // Assert
      expect(actualServices).toEqual([
        {
          data: 1,
          label: 'ISO 14001:2015',
          key: '1-ISO 14001:2015',
          checked: false,
          children: [],
        },
      ]);
    });

    test('should not load members permissions services if admin permissions received', () => {
      // Arrange
      store.reset({
        settings: {
          ...store.snapshot().settings,
          permissionsData: MEMBER_PERMISSIONS_DTO,
          hasReceivedAdminPermissions: true,
        },
      });

      // Act
      store.dispatch(new SaveMemberPermissionsCompanies([1]));

      const actualServices = store.selectSnapshot(
        (state) => state.settings.services,
      );

      // Assert
      expect(actualServices).toEqual([]);
    });
  });

  describe('generateMemberPermissionsServicesOptions', () => {
    test('should return EMPTY when hasReceivedAdminPermissions is true', () => {
      // Arrange
      store.reset({
        settings: {
          ...store.snapshot().settings,
          hasReceivedAdminPermissions: true,
        },
      });

      const action = new GenerateMemberPermissionsServicesOptions([]);

      // Act
      const result = store.dispatch(action);
      const state = store.selectSnapshot((s) => s.settings);

      // Assert
      result.pipe(isEmpty()).subscribe((res) => {
        expect(res).toEqual(true);
      });

      expect(state.servicesDropdownDisabled).toBe(true);
    });

    test('should update state when selectedCompanyIds is empty', () => {
      // Arrange
      store.reset({
        settings: {
          ...store.snapshot().settings,
          hasReceivedAdminPermissions: false,
        },
      });

      const action = new GenerateMemberPermissionsServicesOptions([]);

      // Act
      store.dispatch(action);

      // Assert
      const state = store.selectSnapshot((s) => s.settings);
      expect(state.servicesDropdownDisabled).toBe(true);
      expect(state.services).toEqual([]);
    });

    test('should enable the services dropdown and populate services when companies are selected', () => {
      // Arrange
      const selectedCompanyIds = [1];
      const permissionsData = MEMBER_PERMISSIONS_DTO;

      store.reset({
        settings: {
          ...store.snapshot().settings,
          hasReceivedAdminPermissions: false,
          permissionsData,
        },
      });

      const action = new GenerateMemberPermissionsServicesOptions(
        selectedCompanyIds,
      );

      // Act
      store.dispatch(action);
      const state = store.selectSnapshot((s) => s.settings);

      // Assert
      expect(state.servicesDropdownDisabled).toBe(false);
      expect(state.services.length).toBeGreaterThan(0);
    });

    test('should update state with empty selected service IDs when selected companies change', () => {
      // Arrange
      const selectedCompanyIds = [13];
      const permissionsData = MEMBER_PERMISSIONS_DTO;

      store.reset({
        settings: {
          ...store.snapshot().settings,
          hasReceivedAdminPermissions: false,
          permissionsData,
          selectedCompanyIds: [1, 13],
          selectedServiceIds: [1],
        },
      });

      const action = new GenerateMemberPermissionsServicesOptions(
        selectedCompanyIds,
      );

      // Act
      store.dispatch(action);

      const state = store.selectSnapshot((s) => s.settings);

      // Assert
      expect(state.services).toStrictEqual([
        {
          data: 1475,
          label: 'HACCP',
          key: '1475-HACCP',
          checked: false,
          children: [],
        },
      ]);
      expect(state.selectedServiceIds).toEqual([]);
    });

    test('should update state with filtered selected service IDs based on newly selected companies', () => {
      // Arrange
      const selectedCompanyIds = [13];
      const permissionsData = MEMBER_PERMISSIONS_DTO;

      store.reset({
        settings: {
          ...store.snapshot().settings,
          hasReceivedAdminPermissions: false,
          permissionsData,
          selectedCompanyIds: [1, 13],
          selectedServiceIds: [1, 1475],
        },
      });

      const action = new GenerateMemberPermissionsServicesOptions(
        selectedCompanyIds,
      );

      // Act
      store.dispatch(action);

      const state = store.selectSnapshot((s) => s.settings);

      // Assert
      expect(state.selectedServiceIds).toEqual([1475]);
    });
  });

  test('should reset selected co-browsing company and its ID', () => {
    // Arrange
    store.reset({
      settings: {
        ...store.snapshot().settings,
        selectedCoBrowsingCompany: {
          companyId: 123,
          companyName: 'Test Company',
        },
        selectedCoBrowsingCompanyId: 123,
      },
    });

    // Act
    store.dispatch(new ResetSelectedCobrowsingCompany());
    const actualState = store.selectSnapshot((s) => s.settings);

    // Assert
    expect(actualState.selectedCoBrowsingCompany).toBeNull();
    expect(actualState.selectedCoBrowsingCompanyId).toBeNull();
  });
});
