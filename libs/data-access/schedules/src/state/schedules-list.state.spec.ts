import { signal } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { NgxsModule, StateContext, Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import {
  createProfileStoreServiceMock,
  createSettingsCoBrowsingStoreServiceMock,
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
} from '@customer-portal/data-access/settings';
import {
  PermissionCategories,
  PermissionsList,
} from '@customer-portal/permissions';
import {
  createMessageServiceMock,
  FilteringConfig,
  FilterMode,
  FilterOperator,
  GridConfig,
  SortingMode,
} from '@customer-portal/shared';

import { ScheduleExcelPayloadDto, ScheduleListDto } from '../dtos';
import { ScheduleListItemModel } from '../models';
import { ScheduleListService } from '../services';
import {
  ExportSchedulesExcelFail,
  ExportSchedulesExcelSuccess,
  LoadScheduleList,
  UpdateGridConfig,
} from './actions';
import {
  ScheduleListState,
  ScheduleListStateModel,
} from './schedules-list.state';

jest.mock('@customer-portal/shared', () => {
  const actualModule = jest.requireActual('@customer-portal/shared');

  return {
    ...actualModule,
    downloadFileFromByteArray: jest.fn(),
  };
});

describe('ScheduleListState', () => {
  let store: Store;
  let state: ScheduleListState;

  const scheduleServiceMock: Partial<ScheduleListService> = {
    getScheduleList: jest.fn(),
    exportSchedulesExcel: jest.fn().mockReturnValue(of([])),
  };

  const translocoServiceMock = {
    translate: jest.fn().mockImplementation((key) => key), // simple passthrough
  };

  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();

  const profileStoreServiceMock = createProfileStoreServiceMock();

  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  const settingsCompanyDetailsStoreServiceMock: Partial<SettingsCompanyDetailsStoreService> =
    {
      isUserAdmin: signal(false),
    };

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ScheduleListState])],
      providers: [
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
        {
          provide: ScheduleListService,
          useValue: scheduleServiceMock,
        },
        {
          provide: ProfileStoreService,
          useValue: profileStoreServiceMock,
        },
        {
          provide: SettingsCoBrowsingStoreService,
          useValue: settingsCoBrowsingStoreServiceMock,
        },
        {
          provide: SettingsCompanyDetailsStoreService,
          useValue: settingsCompanyDetailsStoreServiceMock,
        },
        {
          provide: TranslocoService,
          useValue: translocoServiceMock,
        },
      ],
    });

    store = TestBed.inject(Store);
    state = TestBed.inject(ScheduleListState);
  });

  describe('LoadScheduleList', () => {
    test('should request schedules, save transformed result into the state and fill filterOptions in state when schedule edit permission is true', fakeAsync(() => {
      // Arrange
      const mockedScheduleListResponse: ScheduleListDto = {
        data: [
          {
            siteAuditId: 3075,
            startDate: '2017-06-24',
            endDate: '2024-05-28',
            status: 'Completed',
            services: ['ISO 9001:2015'],
            site: 'Site 1',
            city: 'London',
            auditType: 'Periodic Audit; P1',
            leadAuditor: 'Lead Auditor 1',
            siteRepresentatives: ['Site Representative 1'],
            company: 'Company 1',
            siteAddress: 'Peliyagoda Warehouse Complex',
            auditID: 2420734,
            siteZip: 140455,
            siteCountry: 'Germany',
            siteState: '',
            reportingCountry: 'PL',
            projectNumber: 'RJC-495104-2013-MSC-POL',
          },
        ],
        isSuccess: true,
      };

      const expectedSchedulesInState: ScheduleListItemModel[] = [
        {
          scheduleId: 3075,
          siteAuditId: 3075,
          startDate: '24-06-2017',
          endDate: '28-05-2024',
          status: 'Completed',
          service: 'ISO 9001:2015',
          site: 'Site 1',
          city: 'London',
          auditType: 'Periodic Audit; P1',
          leadAuditor: 'Lead Auditor 1',
          siteRepresentative: 'Site Representative 1',
          company: 'Company 1',
          siteAddress: 'Peliyagoda Warehouse Complex',
          auditID: 2420734,
          siteZip: 140455,
          siteCountry: 'Germany',
          siteState: '',
          reportingCountry: 'PL',
          projectNumber: 'RJC-495104-2013-MSC-POL',
          eventActions: {
            id: 3075,
            displayConfirmButton: false,
            displayConfirmedLabel: false,
            actions: [
              {
                label: 'reschedule',
                i18nKey: 'gridEvent.reschedule',
                icon: 'pi pi-calendar',
                disabled: true,
              },
              {
                label: 'shareInvite',
                i18nKey: 'gridEvent.shareInvite',
                icon: 'pi pi-share-alt',
                disabled: true,
              },
              {
                label: 'addToCalendar',
                i18nKey: 'gridEvent.addToCalendar',
                icon: 'pi pi-calendar-plus',
                disabled: true,
              },
              {
                label: 'requestChanges',
                i18nKey: 'gridEvent.requestChanges',
                icon: 'pi pi-pencil',
                disabled: true,
              },
            ],
          },
        },
      ];
      const expectedFilterOptions = {
        status: [
          {
            label: 'Completed',
            value: 'Completed',
          },
        ],
        service: [
          {
            label: 'ISO 9001:2015',
            value: 'ISO 9001:2015',
          },
        ],
        site: [
          {
            label: 'Site 1',
            value: 'Site 1',
          },
        ],
        city: [
          {
            label: 'London',
            value: 'London',
          },
        ],
        auditType: [
          {
            label: 'Periodic Audit; P1',
            value: 'Periodic Audit; P1',
          },
        ],
        leadAuditor: [
          {
            label: 'Lead Auditor 1',
            value: 'Lead Auditor 1',
          },
        ],
        siteRepresentative: [
          {
            label: 'Site Representative 1',
            value: 'Site Representative 1',
          },
        ],
        company: [
          {
            label: 'Company 1',
            value: 'Company 1',
          },
        ],
        startDate: [
          {
            label: '24-06-2017',
            value: '24-06-2017',
          },
        ],
        endDate: [
          {
            label: '28-05-2024',
            value: '28-05-2024',
          },
        ],
        siteAuditId: [
          {
            label: '3075',
            value: '3075',
          },
        ],
      };

      jest
        .spyOn(scheduleServiceMock, 'getScheduleList')
        .mockReturnValueOnce(of(mockedScheduleListResponse));
      jest
        .spyOn(profileStoreServiceMock, 'hasPermission')
        .mockReturnValue(() => true);

      // Mock isDnvUser to return false (needed for ScheduleListMapperService)
      jest
        .spyOn(settingsCoBrowsingStoreServiceMock, 'isDnvUser')
        .mockReturnValue(false);

      jest
        .spyOn(settingsCompanyDetailsStoreServiceMock, 'isUserAdmin')
        .mockReturnValue(false);

      // Act
      store.dispatch(new LoadScheduleList());
      tick();
      const actualSchedulesInState = store.selectSnapshot(
        (s) => s.scheduleList.schedules,
      );
      const actualFilterOptions = store.selectSnapshot(
        (s) => s.scheduleList.filterOptions,
      );

      // Assert
      expect(profileStoreServiceMock.hasPermission).toHaveBeenCalledWith(
        PermissionCategories.Schedule,
        PermissionsList.Edit,
      );
      expect(settingsCoBrowsingStoreServiceMock.isDnvUser).toHaveBeenCalled();
      expect(
        settingsCompanyDetailsStoreServiceMock.isUserAdmin,
      ).toHaveBeenCalled();
      expect(actualSchedulesInState).toEqual(expectedSchedulesInState);
      expect(actualFilterOptions).toEqual(expectedFilterOptions);
    }));
  });

  describe('UpdateGridConfig', () => {
    test('should save grid config into the state', () => {
      // Arrange
      const gridConfig: GridConfig = {
        filtering: {
          company: {
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
            value: [
              {
                label: 'Company 1',
                value: 'Company 1',
              },
            ],
          },
        },
        sorting: { mode: SortingMode.Multiple, rules: [] },
        pagination: {
          paginationEnabled: true,
          pageSize: 10,
          startIndex: 0,
        },
      };

      // Act
      store.dispatch(new UpdateGridConfig(gridConfig));
      const actualGridConfig = store.selectSnapshot(
        (s) => s.scheduleList.gridConfig,
      );

      // Assert
      expect(actualGridConfig).toEqual(gridConfig);
    });
  });

  describe('ExportSchedulesExcel', () => {
    test('should request download schedules excel based on user filters and dispatch ExportSchedulesExcelSuccess on successful export', (done) => {
      // Arrange
      const userFilters: FilteringConfig = {
        startDate: {
          matchMode: FilterMode.DateAfter,
          operator: FilterOperator.And,
          value: [
            {
              label: '01-05-2024',
              value: '01-05-2024',
            },
            {
              label: '04-05-2024',
              value: '04-05-2024',
            },
          ],
        },
        endDate: {
          matchMode: FilterMode.DateBefore,
          operator: FilterOperator.And,
          value: [
            {
              label: '07-05-2024',
              value: '07-05-2024',
            },
            {
              label: '11-05-2024',
              value: '11-05-2024',
            },
          ],
        },
        status: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [
            {
              label: 'Completed',
              value: 'Completed',
            },
          ],
        },
        service: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [
            {
              label: 'IFS Food version 8 April 2023',
              value: 'IFS Food version 8 April 2023',
            },
          ],
        },
        site: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [
            {
              label: 'Calenberger Strasse 36',
              value: 'Calenberger Strasse 36',
            },
          ],
        },
        city: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [
            {
              label: 'Nordstemmen',
              value: 'Nordstemmen',
            },
          ],
        },
        auditType: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [
            {
              label: 'Audit Preparation',
              value: 'Audit Preparation',
            },
          ],
        },
        leadAuditor: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [
            {
              label: 'Mahi',
              value: 'Mahi',
            },
          ],
        },
        siteRepresentative: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [
            {
              label: 'Site Representative 1',
              value: 'Site Representative 1',
            },
          ],
        },
        company: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [
            {
              label: 'Company 1',
              value: 'Company 1',
            },
          ],
        },
      };

      const expectedPayload: ScheduleExcelPayloadDto = {
        filters: {
          startDate: ['2024-05-01', '2024-05-04'],
          endDate: ['2024-05-07', '2024-05-11'],
          status: ['Completed'],
          service: ['IFS Food version 8 April 2023'],
          site: ['Calenberger Strasse 36'],
          city: ['Nordstemmen'],
          auditType: ['Audit Preparation'],
          leadAuditor: ['Mahi'],
          siteRepresentative: ['Site Representative 1'],
          company: ['Company 1'],
          siteAuditId: null,
        },
      };

      const mockState = {
        gridConfig: {
          filtering: userFilters,
        },
      };

      const ctx: Partial<StateContext<ScheduleListStateModel>> = {
        getState: jest.fn().mockReturnValue(mockState),
        patchState: jest.fn(),
        dispatch: jest.fn().mockReturnValue(of(null)),
      };
      (ctx.getState as jest.Mock).mockReturnValue(mockState);

      // Act
      state
        .exportSchedulesExcel(ctx as StateContext<ScheduleListStateModel>)
        .subscribe(() => {
          // Assert
          expect(scheduleServiceMock.exportSchedulesExcel).toHaveBeenCalledWith(
            expectedPayload,
          );
          expect(ctx.dispatch).toHaveBeenCalledWith(
            new ExportSchedulesExcelSuccess([]),
          );
          done();
        });
    });
  });

  describe('ExportSchedulesExcelSuccess', () => {
    test('should download the file and show a success toast', () => {
      // Act
      store.dispatch(new ExportSchedulesExcelSuccess([]));

      // Assert
      expect(messageServiceMock.add).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'success' }),
      );
    });
  });

  describe('ExportSchedulesExcelFail', () => {
    test('should show an export fail toast', () => {
      // Act
      store.dispatch(new ExportSchedulesExcelFail());

      // Assert
      expect(messageServiceMock.add).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'error' }),
      );
    });
  });

  // TODO: add unit tests for download when integration is completed and contactId is removed
});
