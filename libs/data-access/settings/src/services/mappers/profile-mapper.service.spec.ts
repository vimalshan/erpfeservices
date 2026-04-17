import { ProfileDto, ProfileInformationDto } from '../../dtos';
import { ProfileMapperService } from './profile-mapper.service';

describe('ProfileMapperService', () => {
  test('should assign  data', (done) => {
    // Arrange
    const dto: ProfileDto = {
      data: {
        firstName: 'test',
        lastName: 'last',
        displayName: 'abc',
        country: 'India',
        countryCode: 'IN',
        region: 'hyd',
        email: 'test@abc.com',
        phone: '77992612233',
        portalLanguage: 'english',
        veracityId: '123456',
        communicationLanguage: 'English',
        jobTitle: 'admin',
        languages: [
          {
            isSelected: true,
            languageName: 'English',
          },
          {
            isSelected: false,
            languageName: 'Italian',
          },
        ],
        accessLevel: [
          {
            roleName: 'Certificates ',
            roleLevel: [0],
          },
          {
            roleName: 'Contracts ',
            roleLevel: [1, 2],
          },
        ],
        sidebarMenu: [],
      },
      isSuccess: false,
    };

    // Act
    const response = ProfileMapperService.mapToProfileItemModel(dto);

    // Assert
    expect(response).toEqual({
      information: {
        firstName: 'test',
        lastName: 'last',
        displayName: 'abc',
        country: 'India',
        countryCode: 'IN',
        region: 'hyd',
        email: 'test@abc.com',
        phone: '77992612233',
        portalLanguage: 'english',
        veracityId: '123456',
        communicationLanguage: 'English',
        jobTitle: 'admin',
        languages: [
          {
            isSelected: true,
            languageName: 'English',
          },
          {
            isSelected: false,
            languageName: 'Italian',
          },
        ],
        accessLevel: {
          certificates: {
            view: false,
            edit: false,
            noAccess: true,
          },
          contracts: {
            view: true,
            edit: true,
            noAccess: false,
          },
        },
        sidebarMenu: [
          {
            id: 'group1',
            items: [
              {
                i18nKey: 'overview',
                icon: 'home',
                id: 'id-overview',
                isDisabled: false,
                isVisible: true,
                url: '/overview',
              },
            ],
          },
          {
            id: 'group2',
            items: [
              {
                i18nKey: 'contracts',
                icon: 'custom-file-check',
                id: 'id-contracts',
                isDisabled: false,
                isVisible: true,
                url: '/contracts',
              },
              {
                i18nKey: 'schedule',
                icon: 'calendar',
                id: 'id-schedule',
                isDisabled: false,
                isVisible: true,
                url: '/schedule',
              },
              {
                i18nKey: 'audits',
                icon: 'custom-clipboard-edit',
                id: 'id-audits',
                isDisabled: false,
                isVisible: true,
                url: '/audits',
              },
              {
                i18nKey: 'findings',
                icon: 'custom-clipboard-results',
                id: 'id-findings',
                isDisabled: false,
                isVisible: true,
                url: '/findings',
              },
              {
                i18nKey: 'financials',
                icon: 'money-bill',
                id: 'id-financials',
                isDisabled: false,
                isVisible: true,
                url: '/financials',
              },
              {
                i18nKey: 'certificates',
                icon: 'custom-certified',
                id: 'id-certificates',
                isDisabled: false,
                isVisible: false,
                url: '/certificates',
              },
            ],
          },
          {
            id: 'group3',
            items: [
              {
                i18nKey: 'trainings',
                icon: 'graduation-cap',
                id: 'id-trainings',
                isDisabled: false,
                isVisible: true,
                url: '/trainings',
                externalUrl: expect.any(String),
              },
              {
                i18nKey: 'apps',
                icon: 'th-large',
                id: 'id-apps',
                isDisabled: false,
                isVisible: true,
                url: '/apps',
              },
            ],
          },
        ],
      },
    });
    done();
  });

  test('should return null if dto.data is undefined', () => {
    // Arrange
    const dto: ProfileDto = {
      data: undefined as unknown as ProfileInformationDto,
      isSuccess: true,
    };

    // Act
    const result = ProfileMapperService.mapToProfileItemModel(dto);

    // Assert
    expect(result).toBeNull();
  });

  test('should correctly map access roles to permissions', () => {
    // Arrange
    const dto: ProfileDto = {
      data: {
        firstName: 'test',
        lastName: 'last',
        displayName: 'abc',
        country: 'India',
        countryCode: 'IN',
        region: 'hyd',
        email: 'test@abc.com',
        phone: '77992612233',
        portalLanguage: 'english',
        veracityId: '123456',
        communicationLanguage: 'English',
        jobTitle: 'admin',
        languages: [
          {
            isSelected: true,
            languageName: 'English',
          },
          {
            isSelected: false,
            languageName: 'Italian',
          },
        ],
        accessLevel: [
          {
            roleName: 'Certificates ',
            roleLevel: [0],
          },
          {
            roleName: 'Contracts ',
            roleLevel: [1, 2],
          },
        ],
        sidebarMenu: [],
      },
      isSuccess: false,
    };
    const expectedPermissions = {
      certificates: {
        view: false,
        edit: false,
        noAccess: true,
      },
      contracts: {
        view: true,
        edit: true,
        noAccess: false,
      },
    };

    // Act
    const result =
      ProfileMapperService.mapToProfileItemModel(dto)?.information.accessLevel;

    // Assert
    expect(expectedPermissions).toEqual(result);
  });
});
