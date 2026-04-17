import { TestBed } from '@angular/core/testing';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, StateContext, Store } from '@ngxs/store';
import { of } from 'rxjs';

import {
  NavigateFromOverviewCardToAuditListView,
  NavigateFromOverviewCardToFindingsListView,
  NavigateFromOverviewCardToScheduleListView,
} from '@customer-portal/overview-shared';
import { CardDataModel, CardNavigationPayload } from '@customer-portal/shared';

import { OverviewCardsDto } from '../dtos';
import {
  OverviewFilterMapperService,
  OverviewFilterService,
  OverviewService,
} from '../services';
import { OverviewSelectors } from './selectors/overview.selectors';
import {
  LoadMoreOverviewCardData,
  LoadOverviewCardData,
  LoadOverviewFilterCompanies,
  LoadOverviewFilterCompaniesSuccess,
  LoadOverviewFilterServices,
  LoadOverviewFilterServicesSuccess,
  LoadOverviewFilterSites,
  LoadOverviewFilterSitesSuccess,
  ResetOverviewState,
} from './actions';
import { OverviewState, OverviewStateModel } from './overview.state';

describe('OverviewState', () => {
  let store: Store;
  let overviewServiceMock: { getOverviewCardData: jest.Mock };
  let overviewFilterServiceMock: {
    getOverviewFilterCompanies: jest.Mock;
    getOverviewFilterServices: jest.Mock;
    getOverviewFilterSites: jest.Mock;
  };

  let state: OverviewState;
  let ctx: StateContext<OverviewStateModel>;

  const defaultState: OverviewStateModel = {
    filterCompanies: [],
    filterServices: [],
    filterSites: [],
    dataCompanies: [],
    dataServices: [],
    dataSites: [],
    overviewCardData: [],
    prefillCompanies: [],
    prefillServices: [],
    prefillSites: [],
    pageInfo: {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    overviewServiceMock = {
      getOverviewCardData: jest.fn(),
    };
    overviewFilterServiceMock = {
      getOverviewFilterCompanies: jest.fn(),
      getOverviewFilterServices: jest.fn(),
      getOverviewFilterSites: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([OverviewState])],
      providers: [
        {
          provide: OverviewService,
          useValue: overviewServiceMock,
        },
        {
          provide: OverviewFilterService,
          useValue: overviewFilterServiceMock,
        },
      ],
    });

    ctx = {
      getState: jest.fn().mockReturnValue(defaultState),
      patchState: jest.fn(),
      dispatch: jest.fn().mockReturnValue(of(null)),
    } as unknown as StateContext<OverviewStateModel>;

    store = TestBed.inject(Store);
    state = TestBed.inject(OverviewState);
  });

  describe('LoadOverviewCardData', () => {
    test('should load and set overviewCardData and pageInfo in state', () => {
      // Arrange
      const mockDto: OverviewCardsDto = {
        currentPage: 1,
        totalItems: 2,
        totalPages: 1,
        data: [
          {
            serviceName: 'ISO 9001',
            yearData: [
              {
                year: 2024,
                values: [
                  {
                    count: 5,
                    seq: 1,
                    statusValue: 'Confirmed',
                    totalCount: 10,
                  },
                ],
              },
            ],
          },
        ],
      };

      overviewServiceMock.getOverviewCardData.mockReturnValue(of(mockDto));

      // Act
      store.dispatch(new LoadOverviewCardData(false));

      const actualOverviewCardData = store.selectSnapshot(
        OverviewSelectors.overviewCardData,
      );
      const actualPageInfo = store.selectSnapshot(
        (stateSnapshot) => stateSnapshot.overview.pageInfo,
      );

      // Assert
      expect(actualOverviewCardData.length).toBe(1);
      expect(actualOverviewCardData[0].cardData.service).toBe('ISO 9001');
      expect(actualPageInfo).toEqual({
        currentPage: 1,
        totalItems: 2,
        totalPages: 1,
      });
    });
  });

  describe('LoadMoreOverviewCardData', () => {
    test('should load more data and append it to existing overviewCardData', () => {
      // Arrange
      const page1Dto: OverviewCardsDto = {
        currentPage: 1,
        totalItems: 4,
        totalPages: 2,
        data: [
          {
            serviceName: 'ISO A',
            yearData: [],
          },
          {
            serviceName: 'ISO B',
            yearData: [],
          },
        ],
      };

      const page2Dto: OverviewCardsDto = {
        currentPage: 2,
        totalItems: 4,
        totalPages: 2,
        data: [
          {
            serviceName: 'ISO C',
            yearData: [],
          },
          {
            serviceName: 'ISO D',
            yearData: [],
          },
        ],
      };

      overviewServiceMock.getOverviewCardData.mockReturnValueOnce(of(page1Dto));

      // Act
      store.dispatch(new LoadOverviewCardData(false));
      overviewServiceMock.getOverviewCardData.mockReturnValueOnce(of(page2Dto));
      store.dispatch(new LoadMoreOverviewCardData());

      const currentState = store.selectSnapshot(
        (stateSnapshot) => stateSnapshot.overview,
      );
      const serviceNames = currentState.overviewCardData.map(
        (card: CardDataModel) => card.cardData.service,
      );

      // Assert
      expect(currentState.pageInfo.currentPage).toBe(2);
      expect(currentState.overviewCardData.length).toBe(4);
      expect(serviceNames).toEqual(['ISO A', 'ISO B', 'ISO C', 'ISO D']);
    });
  });

  describe('ResetOverviewState', () => {
    test('should reset the overview state to default values', () => {
      // Arrange
      const mockState: OverviewStateModel = {
        filterCompanies: [1, 2],
        filterServices: [5],
        filterSites: [],
        dataCompanies: [{ label: 'Test Company', value: 1 }],
        dataServices: [{ label: 'Test Service', value: 5 }],
        dataSites: [],
        overviewCardData: [
          {
            cardData: {
              service: 'Mock Service',
              yearlyData: [],
            },
          },
        ],
        prefillCompanies: [],
        prefillServices: [],
        prefillSites: [],
        pageInfo: {
          currentPage: 3,
          totalItems: 100,
          totalPages: 10,
        },
      };

      store.reset({
        overview: mockState,
      });

      // Act
      store.dispatch(new ResetOverviewState());

      const afterReset = store.selectSnapshot(
        (currentState) => currentState.overview,
      );

      // Assert
      expect(afterReset).toEqual({
        filterCompanies: [],
        filterServices: [],
        filterSites: [],
        dataCompanies: [],
        dataServices: [],
        dataSites: [],
        overviewCardData: [],
        prefillCompanies: [],
        prefillServices: [],
        prefillSites: [],
        pageInfo: {
          currentPage: 1,
          totalItems: 0,
          totalPages: 0,
        },
      });
    });
  });

  describe('LoadOverviewFilterList', () => {
    test('should dispatch the three individual filter load actions', () => {
      // Act
      state.loadOverviewFilterList(ctx);

      // Assert
      expect(ctx.dispatch).toHaveBeenCalledWith([
        new LoadOverviewFilterCompanies(),
        new LoadOverviewFilterServices(),
        new LoadOverviewFilterSites(),
      ]);
    });
  });

  describe('LoadOverviewFilterCompanies', () => {
    const dummyCompanies = [{ id: 1, name: 'Company A' }];
    const mappedCompanies = [{ label: 'Company A', value: 1 }];
    test('should dispatch LoadOverviewFilterCompaniesSuccess with mapped data', (done) => {
      // Arrange
      overviewFilterServiceMock.getOverviewFilterCompanies.mockReturnValue(
        of({
          isSuccess: true,
          data: dummyCompanies,
        }),
      );

      jest
        .spyOn(OverviewFilterMapperService, 'mapToOverviewFilterList')
        .mockReturnValue(mappedCompanies);

      // Act
      state.loadOverviewFilterCompanies(ctx).subscribe(() => {
        // Assert
        expect(ctx.dispatch).toHaveBeenCalledWith(
          new LoadOverviewFilterCompaniesSuccess(mappedCompanies),
        );
        done();
      });
    });
  });

  describe('LoadOverviewFilterCompaniesSuccess', () => {
    test('should patch the state with new company filter data', () => {
      // Arrange
      const mappedCompanies = [{ label: 'Company A', value: 1 }];

      // Act
      state.loadOverviewFilterCompaniesSuccess(ctx, {
        dataCompanies: mappedCompanies,
      });

      // Assert
      expect(ctx.patchState).toHaveBeenCalledWith({
        dataCompanies: mappedCompanies,
      });
    });
  });

  describe('LoadOverviewFilterServices', () => {
    test('should dispatch LoadOverviewFilterServicesSuccess with mapped data', (done) => {
      // Arrange
      const dummyServices = [{ id: 1, name: 'Service A' }];
      const mappedServices = [{ label: 'Service A', value: 1 }];

      overviewFilterServiceMock.getOverviewFilterServices.mockReturnValue(
        of({
          isSuccess: true,
          data: dummyServices,
        }),
      );

      jest
        .spyOn(OverviewFilterMapperService, 'mapToOverviewFilterList')
        .mockReturnValue(mappedServices);

      // Act
      state.loadOverviewFilterServices(ctx).subscribe(() => {
        // Assert
        expect(ctx.dispatch).toHaveBeenCalledWith(
          new LoadOverviewFilterServicesSuccess(mappedServices),
        );
        done();
      });
    });
  });

  describe('LoadOverviewFilterServicesSuccess', () => {
    test('should patch the state with new service filter data', () => {
      // Arrange
      const mappedServices = [{ label: 'Service A', value: 1 }];

      // Act
      state.loadOverviewFilterServicesSuccess(ctx, {
        dataServices: mappedServices,
      });

      // Assert
      expect(ctx.patchState).toHaveBeenCalledWith({
        dataServices: mappedServices,
      });
    });
  });

  describe('OverviewFilters - Load Overview Filter Sites', () => {
    test('should dispatch LoadOverviewFilterSitesSuccess with mapped data', (done) => {
      // Arrange
      const dummySites = [{ id: 1, name: 'Site A' }];
      const mappedSites = [
        {
          label: 'Site A',
          children: [],
        },
      ];

      overviewFilterServiceMock.getOverviewFilterSites.mockReturnValue(
        of({
          isSuccess: true,
          data: dummySites,
        }),
      );

      jest
        .spyOn(OverviewFilterMapperService, 'mapToOverviewFilterTree')
        .mockReturnValue(mappedSites);

      // Act
      state.loadOverviewFilterSites(ctx).subscribe(() => {
        // Assert
        expect(ctx.dispatch).toHaveBeenCalledWith(
          new LoadOverviewFilterSitesSuccess(mappedSites),
        );
        done();
      });
    });
  });

  describe('LoadOverviewFilterSitesSuccess', () => {
    test('should patch the state with new site filter data', () => {
      // Arrange
      const mappedSites = [
        {
          label: 'Site A',
          children: [],
        },
      ];

      // Act
      state.loadOverviewFilterSitesSuccess(ctx, {
        dataSites: mappedSites,
      });

      // Assert
      expect(ctx.patchState).toHaveBeenCalledWith({
        dataSites: mappedSites,
      });
    });
  });

  describe('NavigateFromOverviewCardToListView', () => {
    const serviceFilter = {
      label: 'service',
      value: [
        {
          label: 'ISO 9001',
          value: 'ISO 9001',
        },
      ],
    };

    const companyFilter = {
      label: 'companyName',
      value: [],
    };

    const citiesFilter = {
      label: 'city',
      value: [],
    };

    const siteFilter = {
      label: 'site',
      value: [],
    };

    test('should navigate to the correct route for "audit" entity', () => {
      // Arrange
      const mockState: OverviewStateModel = { ...defaultState };
      const payload: CardNavigationPayload = {
        entity: 'audit',
        service: 'ISO 9001',
        year: '2025',
      };

      const statusFilter = {
        label: 'status',
        value: [
          {
            label: 'Completed',
            value: 'Completed',
          },
        ],
      };

      const dateFilter = {
        label: 'startDate',
        value: [
          {
            label: '01-01-2025',
            value: '01-01-2025',
          },
          {
            label: '31-12-2025',
            value: '31-12-2025',
          },
        ],
      };

      const expectedOverviewCardFilters = [
        serviceFilter,
        statusFilter,
        dateFilter,
        companyFilter,
        citiesFilter,
        siteFilter,
      ];

      store.reset({
        ...store.snapshot(),
        overview: mockState,
      });

      (ctx.getState as jest.Mock).mockReturnValue(mockState);

      // Act
      state.navigateFromOverviewCardToListView(
        ctx as StateContext<OverviewStateModel>,
        { payload },
      );

      const dispatchCalls = (ctx.dispatch as jest.Mock).mock.calls;

      // Assert
      expect(dispatchCalls[0]).toEqual([
        [
          new Navigate(['/audits']),
          new NavigateFromOverviewCardToAuditListView(
            expectedOverviewCardFilters,
          ),
        ],
      ]);
    });

    test('should navigate to the correct route for "schedule" entity', () => {
      // Arrange
      const mockState: OverviewStateModel = { ...defaultState };
      const payload: CardNavigationPayload = {
        entity: 'schedule',
        service: 'ISO 9001',
        year: '2025',
      };

      const statusFilter = {
        label: 'status',
        value: [
          {
            label: 'Confirmed',
            value: 'Confirmed',
          },
        ],
      };

      const dateFilter = {
        label: 'startDate',
        value: [
          {
            label: '01-01-2025',
            value: '01-01-2025',
          },
          {
            label: '31-12-2025',
            value: '31-12-2025',
          },
        ],
      };

      const expectedOverviewCardFilters = [
        serviceFilter,
        statusFilter,
        dateFilter,
        companyFilter,
        citiesFilter,
        siteFilter,
      ];

      store.reset({
        ...store.snapshot(),
        overview: mockState,
      });

      (ctx.getState as jest.Mock).mockReturnValue(mockState);

      // Act
      state.navigateFromOverviewCardToListView(
        ctx as StateContext<OverviewStateModel>,
        { payload },
      );

      const dispatchCalls = (ctx.dispatch as jest.Mock).mock.calls;

      // Assert
      expect(dispatchCalls[0]).toEqual([
        [
          new Navigate(['/schedule/list']),
          new NavigateFromOverviewCardToScheduleListView(
            expectedOverviewCardFilters,
          ),
        ],
      ]);
    });

    test('should navigate to the correct route for "findings" entity', () => {
      // Arrange
      const mockState: OverviewStateModel = { ...defaultState };
      const payload: CardNavigationPayload = {
        entity: 'findings',
        service: 'ISO 9001',
        year: '2025',
      };

      const statusFilter = {
        label: 'status',
        value: [
          {
            label: 'Closed',
            value: 'Closed',
          },
        ],
      };

      const dateFilter = {
        label: 'openDate',
        value: [
          {
            label: '01-01-2025',
            value: '01-01-2025',
          },
          {
            label: '31-12-2025',
            value: '31-12-2025',
          },
        ],
      };

      const findingsServiceFilter = { ...serviceFilter, label: 'services' };

      const expectedOverviewCardFilters = [
        findingsServiceFilter,
        statusFilter,
        dateFilter,
        companyFilter,
        citiesFilter,
        siteFilter,
      ];

      store.reset({
        ...store.snapshot(),
        overview: mockState,
      });

      (ctx.getState as jest.Mock).mockReturnValue(mockState);

      // Act
      state.navigateFromOverviewCardToListView(
        ctx as StateContext<OverviewStateModel>,
        { payload },
      );

      const dispatchCalls = (ctx.dispatch as jest.Mock).mock.calls;

      // Assert
      expect(dispatchCalls[0]).toEqual([
        [
          new Navigate(['/findings']),
          new NavigateFromOverviewCardToFindingsListView(
            expectedOverviewCardFilters,
          ),
        ],
      ]);
    });

    test('should not dispatch any actions for an invalid entity', () => {
      // Arrange
      const mockState: OverviewStateModel = { ...defaultState };
      const payload: CardNavigationPayload = {
        entity: 'invalidEntity',
        service: 'ISO 9001',
        year: '2025',
      };

      store.reset({
        ...store.snapshot(),
        overview: mockState,
      });

      (ctx.getState as jest.Mock).mockReturnValue(mockState);

      // Act
      state.navigateFromOverviewCardToListView(
        ctx as StateContext<OverviewStateModel>,
        { payload },
      );

      const dispatchCalls = (ctx.dispatch as jest.Mock).mock.calls;

      // Assert
      expect(dispatchCalls).toEqual([]);
    });
  });
});
