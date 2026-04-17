import { runInInjectionContext, signal } from '@angular/core';
import { DatesSetArg } from '@fullcalendar/core';

import { OverviewUpcomingAuditStoreService } from '@customer-portal/data-access/overview';
import { OverviewSharedStoreService } from '@customer-portal/overview-shared';
import { createPreferenceMockInjector } from '@customer-portal/preferences';

import { OverviewUpcomingAuditsComponent } from './overview-upcoming-audits.component';

jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');

  return {
    ...actual,
    effect: jest.fn((fn) => fn()),
  };
});

describe('OverviewUpcomingAuditsComponent', () => {
  let component: OverviewUpcomingAuditsComponent;
  let mockOverviewUpcomingAuditStoreService: Partial<OverviewUpcomingAuditStoreService>;
  let mockOverviewSharedStoreService: Partial<OverviewSharedStoreService>;

  beforeEach(async () => {
    mockOverviewUpcomingAuditStoreService = {
      loadOverviewUpcomingAuditEvents: jest.fn(),
      overviewUpcomingAuditEvent: signal([]),
    };

    mockOverviewSharedStoreService = {
      setSelectedDate: jest.fn(),
    };

    const injector = createPreferenceMockInjector();

    runInInjectionContext(injector, () => {
      component = new OverviewUpcomingAuditsComponent(
        mockOverviewUpcomingAuditStoreService as OverviewUpcomingAuditStoreService,
        mockOverviewSharedStoreService as OverviewSharedStoreService,
      );
    });
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize calendar options on init', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(component.calendarOptions).toBeDefined();
  });

  test('should call setSelectedDate when onButtonClick is triggered', () => {
    // Arrange
    component.visibleMonthDate = new Date();

    // Act
    component.onButtonClick();

    // Assert
    expect(mockOverviewSharedStoreService.setSelectedDate).toHaveBeenCalledWith(
      component.visibleMonthDate,
    );
  });

  test('should set selectedYear and selectedMonth when handleDatesSet is called', () => {
    // Arrange
    const mockViewInfo: Partial<DatesSetArg> = {
      view: { currentStart: new Date(2023, 5, 1) } as any,
    };

    // Act
    component['handleDatesSet'](mockViewInfo as DatesSetArg);

    // Assert
    expect(component.selectedYear).toBe(2023);
    expect(component.selectedMonth).toBe(6);
    expect(component.visibleMonthDate).toEqual(new Date(2023, 6, 1));
  });

  test('should set selectedYear, selectedMonth, and visibleMonthDate correctly', () => {
    // Arrange
    const mockViewInfo: Partial<DatesSetArg> = {
      view: { currentStart: new Date(2023, 5, 1) } as any,
    };
    const expectedDate = new Date(2023, 6, 1);

    // Act
    component['handleDatesSet'](mockViewInfo as DatesSetArg);

    // Assert
    expect(component.visibleMonthDate).toEqual(expectedDate);
    expect(
      mockOverviewUpcomingAuditStoreService.loadOverviewUpcomingAuditEvents,
    ).toHaveBeenCalledWith(6, 2023);
    expect(component.selectedYear).toBe(2023);
    expect(component.selectedMonth).toBe(6);
  });

  test('should call loadOverviewUpcomingAuditEvents and set calendar events in handleDatesSet', () => {
    // Arrange
    const mockViewInfo: Partial<DatesSetArg> = {
      view: { currentStart: new Date(2023, 5, 1) } as any,
    };

    // Act
    component['handleDatesSet'](mockViewInfo as DatesSetArg);

    // Assert
    expect(
      mockOverviewUpcomingAuditStoreService.loadOverviewUpcomingAuditEvents,
    ).toHaveBeenCalledWith(6, 2023);
    expect(component.calendarOptions().events).toBeDefined();
  });

  test('should call setSelectedDate with event in handleDateSelect', () => {
    // Arrange
    const eventDate = new Date();

    // Act
    component['handleDateSelect'](eventDate);

    // Assert
    expect(mockOverviewSharedStoreService.setSelectedDate).toHaveBeenCalledWith(
      eventDate,
    );
  });

  test('should set all expected FullCalendar plugins in calendar options', () => {
    // Act
    component['setCalendarOptions']();

    // Arrange
    const options = component.calendarOptions();

    // Assert
    expect(options.plugins).toBeDefined();
    expect(options.plugins?.length).toBeGreaterThan(0);
  });
});
