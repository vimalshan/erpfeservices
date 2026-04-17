import { Signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';

import { LoggingService, ServiceNowService } from '@customer-portal/core';
import {
  createSettingsCoBrowsingStoreServiceMock,
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
} from '@customer-portal/data-access/settings';
import {
  createMessageServiceMock,
  createTranslationServiceMock,
  Language,
} from '@customer-portal/shared';

import { SettingsTabsCompanyDetailsInfoComponent } from './settings-tabs-company-details-info.component';

describe('SettingsTabsCompanyDetailsInfoComponent', () => {
  let component: SettingsTabsCompanyDetailsInfoComponent;
  let fixture: ComponentFixture<SettingsTabsCompanyDetailsInfoComponent>;
  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();
  const translocoServiceMock: Partial<TranslocoService> =
    createTranslationServiceMock();
  const mockProfileLanguageStoreService: Partial<ProfileLanguageStoreService> =
    {
      languageLabel: (() => 'English' as Language) as Signal<Language>,
    };
  const mockServiceNowService: Partial<ServiceNowService> = {
    openCertificateSupport: jest.fn(),
  };
  const mockLoggingService: Partial<LoggingService> = {
    logException: jest.fn(),
  };
  const settingsStoreServiceMock = {
    loadSettingsCompanyDetails: jest.fn(),
    loadSettingsCompanyDetailsCountryList: jest.fn(),
  };

  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SettingsTabsCompanyDetailsInfoComponent],
      providers: [
        {
          provide: TranslocoService,
          useValue: translocoServiceMock,
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
        {
          provide: ServiceNowService,
          useValue: mockServiceNowService,
        },
        {
          provide: LoggingService,
          useValue: mockLoggingService,
        },
        {
          provide: ProfileLanguageStoreService,
          useValue: mockProfileLanguageStoreService,
        },
        {
          provide: SettingsCompanyDetailsStoreService,
          useValue: settingsStoreServiceMock,
        },
        {
          provide: SettingsCoBrowsingStoreService,
          useValue: settingsCoBrowsingStoreServiceMock,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SettingsTabsCompanyDetailsInfoComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    // Arrange
    const data = {
      accountId: '1',
      address: 'rabbit address',
      city: 'rabbit city',
      country: 'rabbit country',
      organizationName: 'rabbit org',
      poNumberRequired: false,
      vatNumber: 'rabbit101010',
      zipcode: 9000,
    };
    fixture.componentRef.setInput('data', data);

    // Assert
    expect(component.data()).toStrictEqual(data);
    expect(component.hasAccordion()).toBeFalsy();
    expect(component.isOrganizationNameVisible()).toBeFalsy();
    expect(component.isUserAdmin()).toBeFalsy();
    expect(component.title()).toBeUndefined();
  });

  test('should set properties correctly', () => {
    // Arrange
    const data = {
      accountId: '1',
      address: 'rabbit address',
      city: 'rabbit city',
      country: 'rabbit country',
      organizationName: 'rabbit org',
      poNumberRequired: false,
      vatNumber: 'rabbit101010',
      zipcode: 9000,
    };
    fixture.componentRef.setInput('data', data);
    fixture.componentRef.setInput('hasAccordion', true);
    fixture.componentRef.setInput('isOrganizationNameVisible', true);
    fixture.componentRef.setInput('isUserAdmin', true);
    fixture.componentRef.setInput('title', 'Rabbit Title');

    // Act
    TestBed.flushEffects();
    fixture.detectChanges();

    // Assert
    expect(component.data()).toStrictEqual(data);
    expect(component.hasAccordion()).toBeTruthy();
    expect(component.isOrganizationNameVisible()).toBeTruthy();
    expect(component.isUserAdmin()).toBeTruthy();
    expect(component.title()).toBe('Rabbit Title');
  });

  test('should handle onAccordionToggle correctly', () => {
    // Assert
    expect(component.isAccordionOpen).toBe(false);

    // Act
    component.onAccordionToggle();

    // Assert
    expect(component.isAccordionOpen).toBe(true);

    // Act
    component.onAccordionToggle();

    // Assert
    expect(component.isAccordionOpen).toBe(false);
  });

  test('should handle onOpenCompanyDetails correctly when isUserAdmin is false', () => {
    // Arrange
    fixture.componentRef.setInput('isUserAdmin', false);

    // Act
    TestBed.flushEffects();
    fixture.detectChanges();
    component.openServiceNowCompanySettingsSupport();
    // Assert
    expect(messageServiceMock.add).toHaveBeenCalled();
  });
});
