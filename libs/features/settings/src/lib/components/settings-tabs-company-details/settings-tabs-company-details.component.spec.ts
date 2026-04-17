import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';

import {
  SettingsCompanyDetailsStoreService,
  SettingsState,
} from '@customer-portal/data-access/settings';
import {
  createMessageServiceMock,
  createTranslationServiceMock,
} from '@customer-portal/shared';

import { SettingsTabsCompanyDetailsComponent } from './settings-tabs-company-details.component';

describe('SettingsTabsCompanyDetailsComponent', () => {
  let component: SettingsTabsCompanyDetailsComponent;
  let fixture: ComponentFixture<SettingsTabsCompanyDetailsComponent>;
  let translocoServiceMock: Partial<TranslocoService>;
  let settingsStoreServiceMock: Partial<SettingsCompanyDetailsStoreService>;

  beforeEach(() => {
    translocoServiceMock = createTranslationServiceMock();
    settingsStoreServiceMock = {
      loadSettingsCompanyDetails: jest.fn(),
      loadSettingsCompanyDetailsCountryList: jest.fn(),
    };

    const apolloMock: Partial<Apollo> = {
      use: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };

    const messageServiceMock: Partial<MessageService> =
      createMessageServiceMock();

    TestBed.configureTestingModule({
      imports: [
        SettingsTabsCompanyDetailsComponent,
        NgxsModule.forRoot([SettingsState]),
      ],
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
          provide: Apollo,
          useValue: apolloMock,
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
        {
          provide: HttpClient,
          useValue: {},
        },
      ],
    })

      .overrideProvider(SettingsCompanyDetailsStoreService, {
        useValue: settingsStoreServiceMock,
      })
      .compileComponents();
    fixture = TestBed.createComponent(SettingsTabsCompanyDetailsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should handle ngOnInit correctly', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      settingsStoreServiceMock.loadSettingsCompanyDetails,
    ).toHaveBeenCalledTimes(1);
  });
});
