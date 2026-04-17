import { TestBed } from '@angular/core/testing';

import {
  createProfileStoreServiceMock,
  ProfileStoreService,
} from '@customer-portal/data-access/settings';

import { PagePermissionsService } from './page-permissions.service';

describe('PagePermissionsService', () => {
  let service: PagePermissionsService;
  let profileStoreServiceMock: jest.Mocked<ProfileStoreService>;

  beforeEach(() => {
    profileStoreServiceMock = createProfileStoreServiceMock() as any;

    TestBed.configureTestingModule({
      providers: [
        PagePermissionsService,
        { provide: ProfileStoreService, useValue: profileStoreServiceMock },
      ],
    });

    service = TestBed.inject(PagePermissionsService);
  });

  test('should return true when user has the required permission', () => {
    // Arrange
    jest.spyOn(profileStoreServiceMock, 'profileInformation').mockReturnValue({
      firstName: '',
      lastName: '',
      displayName: '',
      country: '',
      countryCode: '',
      region: '',
      email: '',
      phone: '',
      communicationLanguage: 'English',
      jobTitle: 'Certification manager',
      portalLanguage: 'English',
      veracityId: '123456789',
      languages: [{ isSelected: false, languageName: 'English' }],
      accessLevel: { audits: { view: true, edit: true, noAccess: false } },
      sidebarMenu: [],
    });

    // Act
    const result = service.hasPageAccess('audits');

    // Assert
    expect(result).toBe(true);
  });

  test('should return false when user does not have the required permission', () => {
    // Arrange
    jest.spyOn(profileStoreServiceMock, 'profileInformation').mockReturnValue({
      firstName: '',
      lastName: '',
      displayName: '',
      country: '',
      countryCode: '',
      region: '',
      email: '',
      phone: '',
      communicationLanguage: 'English',
      jobTitle: 'Certification manager',
      portalLanguage: 'English',
      veracityId: '123456789',
      languages: [{ isSelected: false, languageName: 'English' }],
      accessLevel: { audits: { view: false, edit: false, noAccess: true } },
      sidebarMenu: [],
    });

    // Act
    const result = service.hasPageAccess('audits');

    // Assert
    expect(result).toBe(false);
  });
});
