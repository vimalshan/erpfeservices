import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { SettingsCompanyDetailsStoreService } from '@customer-portal/data-access/settings';
import { createTranslationServiceMock } from '@customer-portal/shared';

import { SettingsTabsCompanyDetailsModalComponent } from './settings-tabs-company-details-modal.component';

describe('SettingsTabsCompanyDetailsModalComponent', () => {
  let component: SettingsTabsCompanyDetailsModalComponent;
  let fixture: ComponentFixture<SettingsTabsCompanyDetailsModalComponent>;
  let translocoServiceMock: Partial<TranslocoService>;
  let settingsStoreServiceMock: Partial<SettingsCompanyDetailsStoreService>;
  let dynamicDialogRefMock: Partial<DynamicDialogRef>;
  let dynamicDialogConfigMock: Partial<DynamicDialogConfig>;

  beforeEach(() => {
    translocoServiceMock = createTranslationServiceMock();
    settingsStoreServiceMock = {
      updateSettingsCompanyDetails: jest.fn(),
    };
    dynamicDialogRefMock = {
      onClose: {
        subscribe: jest.fn((callback) => {
          callback(true);
        }),
      } as any,
    };
    dynamicDialogConfigMock = {
      data: {
        formPatch: {
          accountId: '1',
          address: 'rabbit address',
          city: 'rabbit city',
          country: 'rabbit country',
          organizationName: 'rabbit org',
          poNumberRequired: false,
          vatNumber: 'rabbit101010',
          zipcode: 9000,
        },
      },
    };

    TestBed.configureTestingModule({
      imports: [SettingsTabsCompanyDetailsModalComponent],
      providers: [
        {
          provide: TranslocoService,
          useValue: translocoServiceMock,
        },
        {
          provide: SettingsCompanyDetailsStoreService,
          useValue: settingsStoreServiceMock,
        },
        {
          provide: DynamicDialogRef,
          useValue: dynamicDialogRefMock,
        },
        {
          provide: DynamicDialogConfig,
          useValue: dynamicDialogConfigMock,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SettingsTabsCompanyDetailsModalComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    // Arrange
    const formPatch = {
      accountId: '1',
      address: 'rabbit address',
      city: 'rabbit city',
      country: 'rabbit country',
      organizationName: 'rabbit org',
      poNumberRequired: false,
      vatNumber: 'rabbit101010',
      zipcode: 9000,
    };
    fixture.componentRef.setInput('formPatch', formPatch);

    // Assert
    expect(component.formPatch()).toStrictEqual(formPatch);
  });

  test('should set properties correctly', () => {
    // Arrange
    const formPatch = {
      accountId: '1',
      address: 'rabbit address',
      city: 'rabbit city',
      country: 'rabbit country',
      organizationName: 'rabbit org',
      poNumberRequired: false,
      vatNumber: 'rabbit101010',
      zipcode: 9000,
    };
    fixture.componentRef.setInput('formPatch', formPatch);

    // Act
    TestBed.flushEffects();
    fixture.detectChanges();

    // Assert
    expect(component.formPatch()).toStrictEqual(formPatch);
  });

  test('should handle ngOnInit correctly', () => {
    // Arrange
    const setRefObsSpy = jest.spyOn(component, 'setRefObs');

    // Act
    component.ngOnInit();

    // Assert
    expect(setRefObsSpy).toHaveBeenCalled();
  });
});
