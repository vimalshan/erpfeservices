import {
  createOverviewSharedStoreServiceMock,
  OverviewFinancialStatusStoreService,
} from '@customer-portal/data-access/overview';
import { createOverviewFinancialStatusStoreServiceMock } from '@customer-portal/data-access/settings';
import { OverviewSharedStoreService } from '@customer-portal/overview-shared';

import {
  customLegendBorderPlugin,
  OverviewFinancialStatusComponent,
} from './overview-financial-status.component';

describe('OverviewFinancialStatusComponent', () => {
  let component: OverviewFinancialStatusComponent;
  let overviewFinancialStatusStoreServiceMock: Partial<OverviewFinancialStatusStoreService>;
  let overviewSharedStoreServiceMock: Partial<OverviewSharedStoreService>;

  beforeEach(async () => {
    overviewFinancialStatusStoreServiceMock =
      createOverviewFinancialStatusStoreServiceMock();
    overviewSharedStoreServiceMock = createOverviewSharedStoreServiceMock();
    component = new OverviewFinancialStatusComponent(
      overviewFinancialStatusStoreServiceMock as OverviewFinancialStatusStoreService,
      overviewSharedStoreServiceMock as OverviewSharedStoreService,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize financialsStatusChartFilters correctly', () => {
    // Assert
    expect(component.financialsStatusChartFilters).toEqual({
      bodyFilter: 'status',
    });
  });

  test('should initialize overviewFinancialsStatusOptions with predefined options', () => {
    // Assert
    expect(component.overviewFinancialsStatusOptions).toBeDefined();
  });

  test('should call loadOverviewFinancialStatusData on init', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      overviewFinancialStatusStoreServiceMock.loadOverviewFinancialStatusData,
    ).toHaveBeenCalled();
  });

  test('should call navigateFromChartToListView with empty array when viewAllInvoices is called', () => {
    // Act
    component.viewAllInvoices();

    // Assert
    expect(
      overviewSharedStoreServiceMock.navigateFromChartToListView,
    ).toHaveBeenCalledWith([]);
  });

  test('should call navigateFromChartToListView with event data on tooltip button click', () => {
    // Arrange
    const mockEvent = [{ value: 'Value', label: 'Label' }];

    // Act
    component.onTooltipButtonClick(mockEvent);

    // Assert
    expect(
      overviewSharedStoreServiceMock.navigateFromChartToListView,
    ).toHaveBeenCalledWith(mockEvent);
  });

  test('should initialize doughnutPlugins with custom and total plugins', () => {
    // Assert
    expect(component.doughnutPlugins.length).toBeGreaterThan(0);
    expect(component.doughnutPlugins).toEqual([
      ...component.doughnutCustomPlugins,
    ]);
  });

  test('should set doughnutType to ChartTypeEnum.Doughnut', () => {
    // Assert
    expect(component.doughnutType).toBe('doughnut');
  });

  test('should contain customLegendBorderPlugin and customLegendSpacingPlugin in doughnutPlugins', () => {
    // Arrange
    const pluginIds = component.doughnutPlugins.map((p: any) => p.id);

    // Assert
    expect(pluginIds).toContain('customLegendBorder');
    expect(pluginIds).toContain('customLegendSpacing');
  });

  test('customLegendBorderPlugin.afterDraw should draw border if legend exists', () => {
    // Arrange
    const mockCtx = {
      save: jest.fn(),
      strokeStyle: '',
      lineWidth: 0,
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      restore: jest.fn(),
    };

    const chartMock = {
      ctx: mockCtx,
      chartArea: { left: 0, right: 100 },
      legend: { top: 40 },
    };

    // Act
    customLegendBorderPlugin.afterLayout(chartMock); // <-- Required to set state
    customLegendBorderPlugin.afterDraw(chartMock);

    // Assert
    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 39); // 40 - 1
    expect(mockCtx.lineTo).toHaveBeenCalledWith(100, 39);
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  test('customLegendSpacingPlugin.beforeInit should modify legend fit method', () => {
    // Arrange
    const mockLegend = {
      fit: jest.fn(),
      height: 0,
      top: 0,
    };

    const chartMock = { legend: mockLegend };

    // Act
    (component.doughnutCustomPlugins[1] as any).beforeInit(chartMock);
    mockLegend.fit();

    // Assert
    expect(mockLegend.fit).toBeDefined();
    expect(mockLegend.height).toBeLessThanOrEqual(0);
  });
});
