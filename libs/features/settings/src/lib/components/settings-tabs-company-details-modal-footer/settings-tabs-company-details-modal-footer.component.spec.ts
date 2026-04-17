import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { SettingsCompanyDetailsStoreService } from '@customer-portal/data-access/settings';
import { createTranslationServiceMock } from '@customer-portal/shared';

import { SettingsTabsCompanyDetailsModalFooterComponent } from './settings-tabs-company-details-modal-footer.component';

describe('SettingsTabsCompanyDetailsModalFooterComponent', () => {
  let component: SettingsTabsCompanyDetailsModalFooterComponent;
  let fixture: ComponentFixture<SettingsTabsCompanyDetailsModalFooterComponent>;
  let translocoServiceMock: Partial<TranslocoService>;
  let dynamicDialogRefMock: Partial<DynamicDialogRef>;
  let settingsStoreServiceMock: Partial<SettingsCompanyDetailsStoreService>;

  beforeEach(() => {
    translocoServiceMock = createTranslationServiceMock();
    dynamicDialogRefMock = {
      close: jest.fn(),
    };
    settingsStoreServiceMock = {
      loadSettingsCompanyDetails: jest.fn(),
      loadSettingsCompanyDetailsCountryList: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [SettingsTabsCompanyDetailsModalFooterComponent],
      providers: [
        {
          provide: TranslocoService,
          useValue: translocoServiceMock,
        },
        {
          provide: DynamicDialogRef,
          useValue: dynamicDialogRefMock,
        },
        {
          provide: SettingsCompanyDetailsStoreService,
          useValue: settingsStoreServiceMock,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(
      SettingsTabsCompanyDetailsModalFooterComponent,
    );
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should handle onCloseEditSettings correctly', () => {
    // Act
    component.onCloseEditSettings();

    // Assert
    expect(dynamicDialogRefMock.close).toHaveBeenCalledWith();
  });
});
