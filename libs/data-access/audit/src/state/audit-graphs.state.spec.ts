import { TestBed } from '@angular/core/testing';
import { Navigate } from '@ngxs/router-plugin';
import {
  Actions,
  NgxsModule,
  ofActionDispatched,
  StateContext,
  Store,
} from '@ngxs/store';
import { Apollo } from 'apollo-angular';
import { Observable, of, zip } from 'rxjs';

import {
  BarChartModel,
  DoughnutChartModel,
  EMPTY_GRAPH_DATA,
  FilterValue,
} from '@customer-portal/shared';

import {
  AUDIT_DAYS_BAR_CHART_DATA,
  AUDIT_DAYS_DOUGHNUT_CHART_DATA,
  createAuditDaysGridServiceMock,
  createAuditGraphServiceMock,
} from '../__mocks__';
import { AuditChartsTabs } from '../constants';
import { AuditDaysGridService, AuditGraphsService } from '../services';
import {
  LoadAuditDaysBarGraphData,
  LoadAuditDaysDoughnutGraphData,
  LoadAuditDaysGridData,
  LoadAuditsGraphsData,
  LoadAuditStatusBarGraphData,
  LoadAuditStatusBarGraphDataSuccess,
  LoadAuditStatusDoughnutGraphData,
  LoadAuditStatusDoughnutGraphDataSuccess,
  ResetAuditsGraphsData,
  ResetAuditsGraphState,
  SetActiveAuditsTab,
  SetNavigationGridConfig,
} from './actions';
import { AuditGraphsState, AuditGraphsStateModel } from './audit-graphs.state';
import { AuditGraphsSelectors } from './selectors';

describe('AuditGraphsState', () => {
  let store: Store;
  let state: AuditGraphsState;
  let actions$: Observable<any>;

  const auditGraphsServiceMock: Partial<AuditGraphsService> =
    createAuditGraphServiceMock();

  const auditDaysGridServiceMock: Partial<AuditDaysGridService> =
    createAuditDaysGridServiceMock();

  const filterStartDate = new Date('2024-01-01');
  const filterEndDate = new Date('2024-12-31');

  const defaultState = {
    activeTab: AuditChartsTabs.AuditStatus,
    auditStatusDoughnutGraphData: EMPTY_GRAPH_DATA,
    auditStatusBarGraphData: EMPTY_GRAPH_DATA,
    auditDaysDoughnutGraphData: EMPTY_GRAPH_DATA,
    auditDaysBarGraphData: EMPTY_GRAPH_DATA,
    filterStartDate,
    filterEndDate,
    filterCompanies: [],
    filterServices: [],
    filterSites: [],
    dataCompanies: [],
    dataServices: [],
    dataSites: [],
    prefillCompanies: [],
    prefillServices: [],
    prefillSites: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const apolloMock: Partial<Apollo> = {
      use: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AuditGraphsState])],
      providers: [
        {
          provide: Apollo,
          useValue: apolloMock,
        },
        {
          provide: AuditGraphsService,
          useValue: auditGraphsServiceMock,
        },
        {
          provide: AuditDaysGridService,
          useValue: auditDaysGridServiceMock,
        },
      ],
    });

    store = TestBed.inject(Store);
    state = TestBed.inject(AuditGraphsState);
    actions$ = TestBed.inject(Actions);
  });

  describe('loadAuditStatusDoughnutGraphData', () => {
    test('should call getAuditStatusDoughnutGraphData', () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filterCompanies = [0];
      const filterServices = [1];
      const filterSites = [2];

      store.reset({
        auditGraphs: {
          ...defaultState,
          filterStartDate: startDate,
          filterEndDate: endDate,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      // Act
      store.dispatch(new LoadAuditStatusDoughnutGraphData());

      // Assert
      expect(
        auditGraphsServiceMock.getAuditStatusDoughnutGraphData,
      ).toHaveBeenCalledWith(
        startDate,
        endDate,
        filterCompanies,
        filterServices,
        filterSites,
      );
    });
  });

  describe('loadAuditStatusDoughnutGraphDataSuccess', () => {
    test('should write in state auditStatusDoughnutGraphData', () => {
      // Arrange
      const auditStatusDoughnutGraphData: DoughnutChartModel = {
        data: {
          labels: ['In Progress', 'To be confirmed'],
          datasets: [
            {
              data: [6, 5],
              backgroundColor: ['#FAF492', '#FBB482'],
              hoverBackgroundColor: ['#FAF492', '#FBB482'],
            },
          ],
          percentageValues: {
            'In Progress': 54.55,
            'To be confirmed': 45.45,
          },
        },
      };

      // Act
      store.dispatch(
        new LoadAuditStatusDoughnutGraphDataSuccess(
          auditStatusDoughnutGraphData,
        ),
      );

      const actualAuditStatusDoughnutGraphDataInState = store.selectSnapshot(
        AuditGraphsSelectors.auditStatusDoughnutGraphData,
      );

      // Assert
      expect(actualAuditStatusDoughnutGraphDataInState).toEqual(
        auditStatusDoughnutGraphData,
      );
    });
  });

  describe('loadAuditStatusBarGraphData', () => {
    test('should call getAuditStatusBarGraphData', () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filterCompanies = [0];
      const filterServices = [1];
      const filterSites = [2];

      store.reset({
        auditGraphs: {
          ...defaultState,
          filterStartDate: startDate,
          filterEndDate: endDate,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      // Act
      store.dispatch(new LoadAuditStatusBarGraphData());

      // Assert
      expect(
        auditGraphsServiceMock.getAuditStatusBarGraphData,
      ).toHaveBeenCalledWith(
        startDate,
        endDate,
        filterCompanies,
        filterServices,
        filterSites,
      );
    });
  });

  describe('loadAuditStatusBarGraphDataSuccess', () => {
    test('should write in state auditStatusBarGraphData', () => {
      // Arrange
      const auditStatusBarGraphData: BarChartModel = {
        data: {
          labels: [
            'Initial Audit',
            'Periodic Audit; P1',
            'Periodic Audit; P2',
            'Re-certification Audit',
            'Scope Extension',
          ],
          datasets: [
            {
              label: 'In Progress',
              data: [1, 0, 0, 5, 0],
              backgroundColor: '#FAF492',
            },
            {
              label: 'To be confirmed',
              data: [1, 1, 1, 1, 1],
              backgroundColor: '#FBB482',
            },
          ],
        },
      };

      // Act
      store.dispatch(
        new LoadAuditStatusBarGraphDataSuccess(auditStatusBarGraphData),
      );

      const actualAuditStatusBarGraphDataInState = store.selectSnapshot(
        AuditGraphsSelectors.auditStatusBarGraphData,
      );

      // Assert
      expect(actualAuditStatusBarGraphDataInState).toEqual(
        auditStatusBarGraphData,
      );
    });
  });

  describe('LoadAuditDaysDoughnutGraphData', () => {
    test('should request audit by days doughnut chart data, save transformed result into the state', () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filterCompanies = [0];
      const filterServices = [1];
      const filterSites = [2];

      store.reset({
        auditGraphs: {
          ...defaultState,
          filterStartDate: startDate,
          filterEndDate: endDate,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      const serviceSpy = jest
        .spyOn(auditGraphsServiceMock, 'getAuditDaysDoughnutGraphData')
        .mockReturnValueOnce(
          of(AUDIT_DAYS_DOUGHNUT_CHART_DATA.data.auditDaysbyServicePieChart),
        );

      const expectedResult: DoughnutChartModel = {
        data: {
          labels: [
            'ISO Audit',
            'Compliance Check',
            'Security Review',
            'Risk Assessment',
          ],
          datasets: [
            {
              data: [40, 30, 20, 10],
              backgroundColor: ['#4B9CD5', '#1B338C', '#A7D4EE', '#579A42'],
              hoverBackgroundColor: [
                '#4B9CD5',
                '#1B338C',
                '#A7D4EE',
                '#579A42',
              ],
            },
          ],
          percentageValues: {
            'ISO Audit': 40,
            'Compliance Check': 30,
            'Security Review': 20,
            'Risk Assessment': 10,
          },
        },
      };

      // Act
      store.dispatch(new LoadAuditDaysDoughnutGraphData());
      const actualResult = store.selectSnapshot(
        AuditGraphsSelectors.auditDaysDoughnutGraphData,
      );

      // Assert
      expect(serviceSpy).toHaveBeenCalledWith(
        startDate,
        endDate,
        filterCompanies,
        filterServices,
        filterSites,
      );
      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('LoadAuditDaysBarGraphData', () => {
    test('should request audit by days bar chart data, save transformed result into the state', () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filterCompanies = [0];
      const filterServices = [1];
      const filterSites = [2];

      store.reset({
        auditGraphs: {
          ...defaultState,
          filterStartDate: startDate,
          filterEndDate: endDate,
          filterCompanies,
          filterServices,
          filterSites,
        },
      });

      const serviceSpy = jest
        .spyOn(auditGraphsServiceMock, 'getAuditDaysBarGraphData')
        .mockReturnValueOnce(
          of(AUDIT_DAYS_BAR_CHART_DATA.data.getAuditDaysByMonthAndService),
        );

      const expectedResult: BarChartModel = {
        data: {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'November',
            'December',
          ],
          datasets: [
            {
              label: 'ISO 901',
              data: [15, 1, 15, 13, 13, 13, 13, 13],
              backgroundColor: '#4B9CD5',
              borderColor: 'white',
              borderWidth: 2,
            },
            {
              label: 'ISO 27001',
              data: [10, 0, 0, 0, 0, 0, 0, 0],
              backgroundColor: '#1B338C',
              borderColor: 'white',
              borderWidth: 2,
            },
            {
              label: 'ISO 37001',
              data: [25, 0, 0, 0, 0, 0, 0, 0],
              backgroundColor: '#A7D4EE',
              borderColor: 'white',
              borderWidth: 2,
            },
            {
              label: 'ISO 44001',
              data: [0, 20, 13, 21, 21, 21, 21, 21],
              backgroundColor: '#579A42',
              borderColor: 'white',
              borderWidth: 2,
            },
            {
              label: 'ISO 9001',
              data: [0, 5, 4, 52, 52, 52, 52, 52],
              backgroundColor: '#AAFCBA',
              borderColor: 'white',
              borderWidth: 2,
            },
          ],
        },
      };

      // Act
      store.dispatch(new LoadAuditDaysBarGraphData());
      const actualResult = store.selectSnapshot(
        AuditGraphsSelectors.auditDaysBarGraphData,
      );

      // Assert
      expect(serviceSpy).toHaveBeenCalledWith(
        startDate,
        endDate,
        filterCompanies,
        filterServices,
        filterSites,
      );
      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('SetActiveAuditsTab', () => {
    test('should set in the state active tab index', () => {
      // Arrange
      store.reset({
        auditGraphs: {
          activeTab: AuditChartsTabs.AuditDays,
        },
      });

      // Act
      store.dispatch(new SetActiveAuditsTab(AuditChartsTabs.AuditStatus));
      const actualSelectedTab = store.selectSnapshot(
        (stateSnapshot) => stateSnapshot.auditGraphs.activeTab,
      );

      // Assert
      expect(actualSelectedTab).toBe(AuditChartsTabs.AuditStatus);
    });
  });

  describe('ResetAuditsGraphsData', () => {
    test('should reset the chart data in the Audit Status tab', () => {
      // Arrange
      store.reset({
        auditGraphs: {
          auditStatusDoughnutGraphData: { data: {} },
          auditStatusBarGraphData: { data: {} },
          activeTab: AuditChartsTabs.AuditDays,
        },
      });

      // Act
      store.dispatch(new ResetAuditsGraphsData());
      const actualAuditStatusDoughnutGraphDataInState = store.selectSnapshot(
        AuditGraphsSelectors.auditStatusDoughnutGraphData,
      );
      const actualAuditStatusBarGraphDataInState = store.selectSnapshot(
        AuditGraphsSelectors.auditStatusBarGraphData,
      );

      // Assert
      expect(actualAuditStatusDoughnutGraphDataInState).toBe(EMPTY_GRAPH_DATA);
      expect(actualAuditStatusBarGraphDataInState).toBe(EMPTY_GRAPH_DATA);
    });

    test('should reset the chart data in the Audit Days tab', () => {
      // Arrange
      store.reset({
        auditGraphs: {
          auditDaysBarGraphData: { data: {} },
          auditDaysDoughnutGraphData: { data: {} },
          activeTab: AuditChartsTabs.AuditStatus,
        },
      });

      // Act
      store.dispatch(new ResetAuditsGraphsData());
      const actualAuditDaysBarGraphDataInState = store.selectSnapshot(
        AuditGraphsSelectors.auditDaysBarGraphData,
      );
      const actualAuditDaysDoughnutGraphDataInState = store.selectSnapshot(
        AuditGraphsSelectors.auditDaysDoughnutGraphData,
      );

      // Assert
      expect(actualAuditDaysBarGraphDataInState).toBe(EMPTY_GRAPH_DATA);
      expect(actualAuditDaysDoughnutGraphDataInState).toBe(EMPTY_GRAPH_DATA);
    });
  });

  describe('LoadAuditsGraphsData', () => {
    test('should load data for Audit Status tab', (done) => {
      // Arrange
      store.reset({
        auditGraphs: {
          activeTab: AuditChartsTabs.AuditStatus,
        },
      });

      const dispatch$ = zip(
        actions$.pipe(ofActionDispatched(LoadAuditStatusDoughnutGraphData)),
        actions$.pipe(ofActionDispatched(LoadAuditStatusBarGraphData)),
      );

      // Assert
      dispatch$.subscribe(() => {
        done();
      });

      // Act
      store.dispatch(new LoadAuditsGraphsData());
    });

    test('should load data for Audit Days tab', (done) => {
      // Arrange
      store.reset({
        auditGraphs: {
          activeTab: AuditChartsTabs.AuditDays,
        },
      });

      const dispatch$ = zip(
        actions$.pipe(ofActionDispatched(LoadAuditDaysDoughnutGraphData)),
        actions$.pipe(ofActionDispatched(LoadAuditDaysBarGraphData)),
        actions$.pipe(ofActionDispatched(LoadAuditDaysGridData)),
      );

      // Assert
      dispatch$.subscribe(() => {
        done();
      });

      // Act
      store.dispatch(new LoadAuditsGraphsData());
    });
  });

  describe('ResetAuditsGraphState', () => {
    test('should set auditStatusDoughnutGraphData and auditStatusBarGraphData to EMPTY_GRAPH_DATA', () => {
      // Arrange
      store.reset({
        auditGraphs: {
          auditStatusDoughnutGraphData: { data: {} },
          auditStatusBarGraphData: { data: {} },
        },
      });

      // Act
      store.dispatch(new ResetAuditsGraphState());

      const actualAuditStatusDoughnutGraphDataInState = store.selectSnapshot(
        AuditGraphsSelectors.auditStatusDoughnutGraphData,
      );
      const actualAuditStatusBarGraphDataInState = store.selectSnapshot(
        AuditGraphsSelectors.auditStatusBarGraphData,
      );

      // Assert
      expect(actualAuditStatusDoughnutGraphDataInState).toBe(EMPTY_GRAPH_DATA);
      expect(actualAuditStatusBarGraphDataInState).toBe(EMPTY_GRAPH_DATA);
    });
  });

  describe('navigateFromChartToListView', () => {
    test('should dispatch correct actions when navigating from chart to list view', () => {
      // Arrange
      const mockState: AuditGraphsStateModel = {
        ...defaultState,
        auditDaysGridData: [],
        filterStartDate: new Date('2024-01-01'),
        filterEndDate: new Date('2024-12-31'),
        dataServices: [
          {
            label: 'service1',
            value: 0,
          },
          {
            label: 'service2',
            value: 1,
          },
        ],
        filterServices: [],
        prefillSites: [],
      };

      const ctx: Partial<StateContext<AuditGraphsStateModel>> = {
        getState: jest.fn().mockReturnValue(mockState),
        patchState: jest.fn(),
        dispatch: jest.fn().mockReturnValue(of(null)),
      };

      const tooltipFilters = [
        {
          label: 'status',
          value: [
            {
              label: 'In Progress',
              value: 'In Progress',
            },
          ],
        },
        {
          label: 'type',
          value: [
            {
              label: 'Re-certification Audit',
              value: 'Re-certification Audit',
            },
          ],
        },
      ];

      store.reset({
        ...store.snapshot(),
        auditGraphs: mockState,
      });

      const expectedDateFilters = [
        {
          label: 'startDate',
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
      ];
      const expectedServiceFilters = [{ label: 'service', value: [] }];
      const expectedCitiesFilters = [{ label: 'city', value: [] }];
      const expectedSiteFilters = [{ label: 'site', value: [] }];
      const expectedCompanyFilters = [{ label: 'companyName', value: [] }];

      (ctx.getState as jest.Mock).mockReturnValue(mockState);

      // Act
      state.navigateFromChartToListView(
        ctx as StateContext<AuditGraphsStateModel>,
        {
          tooltipFilters,
        },
      );
      const dispatchCalls = (ctx.dispatch as jest.Mock).mock.calls;

      // Assert
      expect(dispatchCalls[0]).toEqual([
        new SetNavigationGridConfig([
          ...tooltipFilters,
          ...expectedDateFilters,
          ...expectedServiceFilters,
          ...expectedCitiesFilters,
          ...expectedSiteFilters,
          ...expectedCompanyFilters,
        ]),
      ]);

      expect(dispatchCalls[1]).toEqual([new Navigate(['/audits'])]);
    });
  });

  describe('navigateFromTreeToListView', () => {
    test('should dispatch correct actions when navigating from tree to list view', () => {
      // Arrange
      const mockState: AuditGraphsStateModel = {
        ...defaultState,
        auditDaysGridData: [],
        filterStartDate: new Date('2024-01-01'),
        filterEndDate: new Date('2024-12-31'),
      };

      const ctx: Partial<StateContext<AuditGraphsStateModel>> = {
        getState: jest.fn().mockReturnValue(mockState),
        patchState: jest.fn(),
        dispatch: jest.fn().mockReturnValue(of(null)),
      };

      store.reset({
        ...store.snapshot(),
        auditGraphs: mockState,
      });

      const filterValue: FilterValue = {
        label: 'country',
        value: 'Norway',
      };

      const expectedDateFilters = [
        {
          label: 'startDate',
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
      ];
      const expectedCountryFilter = [
        {
          label: 'country',
          value: [
            {
              label: 'Norway',
              value: 'Norway',
            },
          ],
        },
      ];

      (ctx.getState as jest.Mock).mockReturnValue(mockState);

      // Act
      state.navigateFromTreeToListView(
        ctx as StateContext<AuditGraphsStateModel>,
        {
          filterValue,
        },
      );
      const dispatchCalls = (ctx.dispatch as jest.Mock).mock.calls;

      // Assert
      expect(dispatchCalls[0]).toEqual([
        new SetNavigationGridConfig([
          ...expectedCountryFilter,
          ...expectedDateFilters,
        ]),
      ]);

      expect(dispatchCalls[1]).toEqual([new Navigate(['/audits'])]);
    });
  });
});
