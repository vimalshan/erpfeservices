import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { NgxsModule, Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import {
  createRouteStoreServiceMock,
  RouteStoreService,
} from '@customer-portal/router';
import {
  createFileSaverMock,
  createMessageServiceMock,
  DEFAULT_GRID_CONFIG,
  FilterMode,
  FilterOperator,
  GridConfig,
  SortingMode,
} from '@customer-portal/shared';

import { FindingsListService } from '../services';
import {
  ExportFindingsExcel,
  LoadFindingsList,
  ResetFindingsListState,
  SetNavigationGridConfig,
  UpdateGridConfig,
} from './actions';
import {
  FindingsListState,
  FindingsListStateModel,
} from './findings-list.state';
import {
  chartNavigationPayload,
  defaultFindingListState,
  expectedFilterOptions,
  expectedFindingsInState,
  expectedRequestDownloadFindingsPayload,
  gridConfig,
  mockedFindingsListResponse,
  userFilters,
} from './findings-list.state.mock';

describe('FindingsListState', () => {
  let store: Store;

  const findingsServiceMock = {
    getFindingList: jest.fn(),
    exportFindingsExcel: jest.fn().mockReturnValue(of({})),
  };

  const translocoServiceMock = {
    translate: jest.fn().mockImplementation((key) => key), // simple passthrough
  };

  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();

  beforeEach(() => {
    jest.clearAllMocks();

    createFileSaverMock();

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([FindingsListState])],
      providers: [
        {
          provide: FindingsListService,
          useValue: findingsServiceMock,
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
        {
          provide: RouteStoreService,
          useValue: createRouteStoreServiceMock(),
        },
        {
          provide: TranslocoService,
          useValue: translocoServiceMock,
        },
      ],
    });

    store = TestBed.inject(Store);
  });

  test('should request findings, save transformed result into the state and fill filterOptions in state', () => {
    // Arrange
    jest
      .spyOn(findingsServiceMock, 'getFindingList')
      .mockReturnValue(of(mockedFindingsListResponse));

    // Act
    store.dispatch(new LoadFindingsList());

    const actualFindingsInState = store.selectSnapshot(
      (state) => state.findingsList.findingsItems,
    );

    const actualFilterOptionsInState = store.selectSnapshot(
      (state) => state.findingsList.filterOptions,
    );

    // Assert
    expect(actualFindingsInState).toEqual(expectedFindingsInState);
    expect(actualFilterOptionsInState).toEqual(expectedFilterOptions);
  });

  test('should save grid config into the state', () => {
    // Arrange

    // Act
    store.dispatch(new UpdateGridConfig(gridConfig));
    const actualGridConfig = store.selectSnapshot(
      (state) => state.findingsList.gridConfig,
    );

    // Assert
    expect(actualGridConfig).toEqual(gridConfig);
  });

  test('should request download findings excel based on user filters and show success message', () => {
    // Arrange
    store.reset({
      findingsList: {
        gridConfig: {
          filtering: userFilters,
        },
      },
    });

    // Act
    store.dispatch(new ExportFindingsExcel());

    // Assert
    expect(findingsServiceMock.exportFindingsExcel).toHaveBeenCalledWith(
      expectedRequestDownloadFindingsPayload,
    );
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' }),
    );
  });

  test('should request download findings excel and show error message', () => {
    // Arrange
    jest.spyOn(console, 'error').mockImplementationOnce(() => {});
    findingsServiceMock.exportFindingsExcel = jest
      .fn()
      .mockReturnValue(throwError(() => new Error('test 404 error')));

    // Act
    store.dispatch(new ExportFindingsExcel());

    // Assert
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error' }),
    );
  });

  test('should reset findings list state to default', () => {
    // Arrange

    store.reset(defaultFindingListState);

    const expectedFindingsListInState: FindingsListStateModel = {
      findingsItems: [],
      gridConfig: DEFAULT_GRID_CONFIG,
      filterOptions: {},
    };

    // Act
    store.dispatch(new ResetFindingsListState());

    const actualFindingsListInState = store.selectSnapshot(
      (state) => state.findingsList,
    );

    // Assert
    expect(actualFindingsListInState).toEqual(expectedFindingsListInState);
  });

  test('should set navigation grid config', () => {
    // Arrange
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
      (state) => state.findingsList.gridConfig,
    );

    // Assert
    expect(actualGridConfig).toEqual(expectedGridConfig);
  });
});
