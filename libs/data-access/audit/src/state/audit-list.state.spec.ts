import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { Actions, NgxsModule, ofActionSuccessful, Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { Observable, of, throwError, zip } from 'rxjs';

import {
  createRouteStoreServiceMock,
  RouteStoreService,
} from '@customer-portal/router';
import {
  createFileSaverMock,
  createMessageServiceMock,
  DEFAULT_GRID_CONFIG,
  FilteringConfig,
  FilterMode,
  FilterOperator,
  FilterValue,
  GridConfig,
  SortingMode,
} from '@customer-portal/shared';

import { AuditExcelPayloadDto, AuditListDto } from '../dtos';
import { AuditListService } from '../services';
import {
  ExportAuditsExcel,
  LoadAuditList,
  LoadAuditListSuccess,
  ResetAuditListState,
  SetNavigationGridConfig,
  UpdateFilterOptions,
  UpdateGridConfig,
} from './actions';
import { AuditListState, AuditListStateModel } from './audit-list.state';

function createMockAuditListDto(data: any[]): AuditListDto {
  return {
    data,
    isSuccess: true,
    message: '',
    errorCode: '',
    __typename: 'AuditListDto',
  };
}

describe('AuditListState', () => {
  let actions$: Observable<any>;
  let store: Store;
  const auditServiceMock = {
    getAuditList: jest.fn(),
    exportAuditsExcel: jest.fn().mockReturnValue(of({})),
  };

  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();

  const mockTranslocoService: Partial<TranslocoService> = {
    translate: jest.fn().mockReturnValue('Translated Text'),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    createFileSaverMock();

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AuditListState])],
      providers: [
        {
          provide: AuditListService,
          useValue: auditServiceMock,
        },
        {
          provide: RouteStoreService,
          useValue: createRouteStoreServiceMock(),
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
        {
          provide: TranslocoService,
          useValue: mockTranslocoService,
        },
      ],
    });

    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions);
  });

  test('should request audits, save transformed result into the state and fill filterOptions in state', (done) => {
    // Arrange
    const mockedAuditListResponse: AuditListDto = createMockAuditListDto([
      {
        auditId: 3067121,
        status: 'Findings to be managed',
        type: 'Audit Preparation',
        companyName: 'mock company',
        startDate: '2023-09-17',
        endDate: '2024-05-16',
        leadAuditor: 'Mahi',
        countries: ['France'],
        cities: ['Nordstemmen'],
        services: ['IFS Food version 8 April 2023'],
        sites: ['Calenberger Strasse 36'],
      },
    ]);
    const expectedAuditsInState = [
      {
        auditNumber: '3067121',
        startDate: '17-09-2023',
        endDate: '16-05-2024',
        country: 'France',
        city: 'Nordstemmen',
        companyName: 'mock company',
        service: 'IFS Food version 8 April 2023',
        site: 'Calenberger Strasse 36',
        leadAuthor: 'Mahi',
        status: 'Findings to be managed',
        type: 'Audit Preparation',
      },
    ];
    const expectedFilterOptions = {
      companyName: [
        {
          label: 'mock company',
          value: 'mock company',
        },
      ],
      auditNumber: [
        {
          label: '3067121',
          value: '3067121',
        },
      ],
      status: [
        {
          label: 'Findings to be managed',
          value: 'Findings to be managed',
        },
      ],
      service: [
        {
          label: 'IFS Food version 8 April 2023',
          value: 'IFS Food version 8 April 2023',
        },
      ],
      site: [
        {
          label: 'Calenberger Strasse 36',
          value: 'Calenberger Strasse 36',
        },
      ],
      country: [
        {
          label: 'France',
          value: 'France',
        },
      ],
      city: [
        {
          label: 'Nordstemmen',
          value: 'Nordstemmen',
        },
      ],
      type: [
        {
          label: 'Audit Preparation',
          value: 'Audit Preparation',
        },
      ],
      leadAuthor: [
        {
          label: 'Mahi',
          value: 'Mahi',
        },
      ],
      startDate: [
        {
          label: '17-09-2023',
          value: '17-09-2023',
        },
      ],
      endDate: [
        {
          label: '16-05-2024',
          value: '16-05-2024',
        },
      ],
    };

    jest
      .spyOn(auditServiceMock, 'getAuditList')
      .mockReturnValueOnce(of(mockedAuditListResponse));

    zip(
      actions$.pipe(ofActionSuccessful(LoadAuditListSuccess)),
      actions$.pipe(ofActionSuccessful(UpdateFilterOptions)),
    ).subscribe(() => {
      // Assert
      const actualAuditsInState = store.selectSnapshot(
        (state) => state.auditList.auditItems,
      );

      const actualAuditsOptionsInState = store.selectSnapshot(
        (state) => state.auditList.filterOptions,
      );
      expect(actualAuditsInState).toEqual(expectedAuditsInState);
      expect(actualAuditsOptionsInState).toEqual(expectedFilterOptions);
      done();
    });

    // Act
    store.dispatch(new LoadAuditList());
  });

  test('should save grid config into the state', () => {
    // Arrange
    const gridConfig: GridConfig = {
      filtering: {
        auditNumber: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [
            {
              label: '3067121',
              value: '3067121',
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
      (state) => state.auditList.gridConfig,
    );

    // Assert
    expect(actualGridConfig).toEqual(gridConfig);
  });

  test('should request download audits excel based on user filters and show success message', () => {
    // Arrange
    const userFilters: FilteringConfig = {
      auditNumber: {
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
        value: [
          {
            label: '3067121',
            value: '3067121',
          },
        ],
      },
      status: {
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
        value: [
          {
            label: 'Findings to be managed',
            value: 'Findings to be managed',
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
      country: {
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
        value: [
          {
            label: 'France',
            value: 'France',
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
      type: {
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
        value: [
          {
            label: 'Audit Preparation',
            value: 'Audit Preparation',
          },
        ],
      },
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
      leadAuthor: {
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
        value: [
          {
            label: 'Mahi',
            value: 'Mahi',
          },
        ],
      },
    };
    store.reset({
      auditList: {
        gridConfig: {
          filtering: userFilters,
        },
      },
    });
    const expectedPayload: AuditExcelPayloadDto = {
      filters: {
        auditId: [3067121],
        country: ['France'],
        city: ['Nordstemmen'],
        service: ['IFS Food version 8 April 2023'],
        companyName: null,
        leadAuditor: ['Mahi'],
        site: ['Calenberger Strasse 36'],
        type: ['Audit Preparation'],
        status: ['Findings to be managed'],
        startDate: ['2024-05-01', '2024-05-04'],
        endDate: ['2024-05-07', '2024-05-11'],
      },
    };

    // Act
    store.dispatch(new ExportAuditsExcel());

    // Assert
    expect(auditServiceMock.exportAuditsExcel).toHaveBeenCalledWith(
      expectedPayload,
    );
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' }),
    );
  });

  test('should request download audits excel and show error message', () => {
    // Arrange
    jest.spyOn(console, 'error').mockImplementationOnce(() => {});
    auditServiceMock.exportAuditsExcel = jest
      .fn()
      .mockReturnValue(throwError(() => new Error('test 404 error')));

    // Act
    store.dispatch(new ExportAuditsExcel());

    // Assert
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error' }),
    );
  });

  test('should reset audit list state to default', () => {
    // Arrange
    store.reset({
      auditList: {
        auditItems: [
          {
            auditNumber: '3067121',
            startDate: '17-09-2023',
            endDate: '16-05-2024',
            city: 'Nordstemmen',
            service: 'IFS Food version 8 April 2023',
            site: 'Calenberger Strasse 36',
            leadAuthor: 'Mahi',
            status: 'Findings to be managed',
            type: 'Audit Preparation',
          },
        ],
        gridConfig: {
          filtering: {
            auditNumber: {
              matchMode: FilterMode.In,
              operator: FilterOperator.And,
              value: [
                {
                  label: '3067121',
                  value: '3067121',
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
        },
        filterOptions: {
          auditNumber: {
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
            value: [
              {
                label: '3067121',
                value: '3067121',
              },
            ],
          },
          status: {
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
            value: [
              {
                label: 'Findings to be managed',
                value: 'Findings to be managed',
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
          country: {
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
            value: [
              {
                label: 'France',
                value: 'France',
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
          type: {
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
            value: [
              {
                label: 'Audit Preparation',
                value: 'Audit Preparation',
              },
            ],
          },
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
          leadAuthor: {
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
            value: [
              {
                label: 'Mahi',
                value: 'Mahi',
              },
            ],
          },
        },
      },
    });

    const expectedAuditListInState: AuditListStateModel = {
      auditItems: [],
      gridConfig: DEFAULT_GRID_CONFIG,
      filterOptions: {},
    };

    // Act
    store.dispatch(new ResetAuditListState());

    const actualAuditListInState = store.selectSnapshot(
      (state) => state.auditList,
    );

    // Assert
    expect(actualAuditListInState).toEqual(expectedAuditListInState);
  });

  test('should set navigation grid config', () => {
    // Arrange
    const chartNavigationPayload: FilterValue[] = [
      {
        label: 'status',
        value: [
          {
            label: 'Open',
            value: 'Open',
          },
        ],
      },
      {
        label: 'openDate',
        value: [
          {
            label: '01-01-2024',
            value: '01-01-2024',
          },
          {
            label: '31-12-2024',
            value: '31-12-2024',
          },
        ],
      },
      {
        label: 'services',
        value: [],
      },
      {
        label: 'city',
        value: [],
      },
      {
        label: 'site',
        value: [],
      },
    ];
    const expectedGridConfig: GridConfig = {
      pagination: {
        paginationEnabled: true,
        pageSize: 10,
        startIndex: 0,
      },
      sorting: {
        mode: SortingMode.Multiple,
        rules: [],
      },
      filtering: {
        status: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [
            {
              label: 'Open',
              value: 'Open',
            },
          ],
        },
        openDate: {
          matchMode: FilterMode.DateBefore,
          operator: FilterOperator.And,
          value: [
            {
              label: '01-01-2024',
              value: '01-01-2024',
            },
            {
              label: '31-12-2024',
              value: '31-12-2024',
            },
          ],
        },
        services: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [],
        },
        city: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [],
        },
        site: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [],
        },
      },
    };

    // Act
    store.dispatch(new SetNavigationGridConfig(chartNavigationPayload));
    const actualGridConfig = store.selectSnapshot(
      (state) => state.auditList.gridConfig,
    );

    // Assert
    expect(actualGridConfig).toEqual(expectedGridConfig);
  });
});
