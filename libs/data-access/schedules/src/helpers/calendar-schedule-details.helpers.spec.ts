import { ScheduleStatus } from '../constants';
import { CalendarScheduleModel } from '../models';
import { getScheduleDetails } from './calendar-schedule-details.helpers';

describe('getScheduleDetails', () => {
  test('should return the correct schedule details when schedule is found', () => {
    // Arrange
    const schedules: CalendarScheduleModel[] = [
      {
        scheduleId: '1',
        startDate: '2025-01-01',
        endDate: '2025-02-02',
        leadAuditor: 'John Doe',
        siteRepresentative: 'Jane Doe',
        status: ScheduleStatus.Confirmed,
        address: 'Address 1',
        auditType: 'Periodic Audit; P2',
        city: 'City 1',
        company: 'Company 1',
        service: 'Service 1',
        site: 'Site 1',
      },
    ];
    const id = '1';

    // Act
    const result = getScheduleDetails(schedules, id);

    // Assert
    expect(result).toEqual({
      scheduleId: 1,
      startDate: '01.01.2025',
      endDate: '02.02.2025',
      leadAuditor: 'John Doe',
      siteRepresentative: 'Jane Doe',
      status: 'Confirmed',
      address: 'Address 1',
      auditType: 'Periodic Audit; P2',
      city: 'City 1',
      company: 'Company 1',
      service: 'Service 1',
      site: 'Site 1',
      auditor: 'John Doe',
      shareInvite: true,
    });
  });

  test('should return null when no matching schedule is found', () => {
    // Arrange
    const schedules: CalendarScheduleModel[] = [
      {
        scheduleId: '1',
        startDate: '01.01.2025',
        endDate: '02.02.2025',
        leadAuditor: 'John Doe',
        siteRepresentative: 'Jane Doe',
        status: ScheduleStatus.Confirmed,
        address: 'Address 1',
        auditType: 'Periodic Audit; P2',
        city: 'City 1',
        company: 'Company 1',
        service: 'Service 1',
        site: 'Site 1',
      },
    ];
    const id = '2';

    // Act
    const result = getScheduleDetails(schedules, id);

    // Assert
    expect(result).toBeNull();
  });

  test('should set shareInvite to false when schedule status is neither Confirmed nor ToBeConfirmed', () => {
    // Arrange
    const schedules: CalendarScheduleModel[] = [
      {
        scheduleId: '1',
        startDate: '01.01.2025',
        endDate: '02.02.2025',
        leadAuditor: 'John Doe',
        siteRepresentative: 'Jane Doe',
        status: ScheduleStatus.ToBeConfirmedByDnv,
        address: 'Address 1',
        auditType: 'Periodic Audit; P2',
        city: 'City 1',
        company: 'Company 1',
        service: 'Service 1',
        site: 'Site 1',
      },
    ];
    const id = '1';

    // Act
    const result = getScheduleDetails(schedules, id);

    // Assert
    expect(result?.shareInvite).toBe(false);
  });
});
