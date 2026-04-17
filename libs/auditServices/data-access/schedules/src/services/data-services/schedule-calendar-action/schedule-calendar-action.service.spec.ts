import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import {
  SCHEDULE_CALENDAR_CONFIRM_MUTATION,
  SCHEDULE_CALENDAR_INVITE_QUERY,
  SCHEDULE_CALENDAR_RESCHEDULE_MUTATION,
  SCHEDULE_CALENDAR_RESCHEDULE_REASONS_QUERY,
} from '../../../graphql';
import { ScheduleCalendarActionService } from './schedule-calendar-action.service';

describe('ScheduleCalendarActionService', () => {
  const mockApollo: Partial<Apollo> = {
    mutate: jest.fn(),
    query: jest.fn(),
    use: jest.fn().mockReturnThis(),
  };
  let service: ScheduleCalendarActionService;

  beforeEach(() => {
    service = new ScheduleCalendarActionService(mockApollo as Apollo);
  });

  test('should call getScheduleCalendarAddToCalendar and handle valid data', (done) => {
    // Arrange
    const addToCalender = { icsResponse: [] };
    mockApollo.query = jest.fn().mockReturnValue(
      of({
        data: {
          addToCalender,
        },
      }),
    );

    // Act
    service.getScheduleCalendarAddToCalendar(100).subscribe((result) => {
      // Assert
      expect(mockApollo.query).toHaveBeenCalledWith({
        query: SCHEDULE_CALENDAR_INVITE_QUERY,
        variables: {
          isAddToCalender: true,
          siteAuditId: 100,
        },
        fetchPolicy: 'no-cache',
      });
      expect(result).toBe(addToCalender);
      done();
    });
  });

  test('should call getScheduleCalendarAddToCalendar and handle invalid data', (done) => {
    // Arrange
    mockApollo.query = jest.fn().mockReturnValue(of({}));

    // Act
    service.getScheduleCalendarAddToCalendar(100).subscribe((result) => {
      // Assert
      expect(mockApollo.query).toHaveBeenCalledWith({
        query: SCHEDULE_CALENDAR_INVITE_QUERY,
        variables: {
          isAddToCalender: true,
          siteAuditId: 100,
        },
        fetchPolicy: 'no-cache',
      });
      expect(result).toBe(undefined);
      done();
    });
  });

  test('should call getScheduleCalendarShareInvite and handle valid data', (done) => {
    // Arrange
    const addToCalender = {
      icsResponse: [],
      calendarAttributes: {
        auditType: 'Rabbit Audit Type',
        endDate: new Date('02-02-2025'),
        leadAuditor: 'Mr Rabbit',
        service: 'Rabbit Service',
        site: 'Rabbit Site',
        siteAddress: 'Rabbit Address',
        siteRepresentative: 'Rabbit Representative',
        startDate: new Date('01-01-2025'),
      },
    };
    mockApollo.query = jest.fn().mockReturnValue(
      of({
        data: {
          addToCalender,
        },
      }),
    );

    // Act
    service.getScheduleCalendarShareInvite(100).subscribe((result) => {
      // Assert
      expect(mockApollo.query).toHaveBeenCalledWith({
        query: SCHEDULE_CALENDAR_INVITE_QUERY,
        variables: {
          isAddToCalender: false,
          siteAuditId: 100,
        },
        fetchPolicy: 'no-cache',
      });
      expect(result).toBe(addToCalender);
      done();
    });
  });

  test('should call getScheduleCalendarShareInvite and handle invalid data', (done) => {
    // Arrange
    mockApollo.query = jest.fn().mockReturnValue(of({}));

    // Act
    service.getScheduleCalendarShareInvite(100).subscribe((result) => {
      // Assert
      expect(mockApollo.query).toHaveBeenCalledWith({
        query: SCHEDULE_CALENDAR_INVITE_QUERY,
        variables: {
          isAddToCalender: false,
          siteAuditId: 100,
        },
        fetchPolicy: 'no-cache',
      });
      expect(result).toBe(undefined);
      done();
    });
  });

  test('should call getScheduleCalendarRescheduleReasons and handle valid data', (done) => {
    // Arrange
    const reScheduleReasons = [
      {
        id: 1,
        reasonDescription: 'Rabbit',
      },
      {
        id: 2,
        reasonDescription: 'Fox',
      },
    ];
    mockApollo.query = jest.fn().mockReturnValue(
      of({
        data: {
          reScheduleReasons,
        },
      }),
    );

    // Act
    service.getScheduleCalendarRescheduleReasons().subscribe((result) => {
      // Assert
      expect(mockApollo.query).toHaveBeenCalledWith({
        query: SCHEDULE_CALENDAR_RESCHEDULE_REASONS_QUERY,
      });
      expect(result).toBe(reScheduleReasons);
      done();
    });
  });

  test('should call getScheduleCalendarRescheduleReasons and handle valid data', (done) => {
    // Arrange
    mockApollo.query = jest.fn().mockReturnValue(of({}));

    // Act
    service.getScheduleCalendarRescheduleReasons().subscribe((result) => {
      // Assert
      expect(mockApollo.query).toHaveBeenCalledWith({
        query: SCHEDULE_CALENDAR_RESCHEDULE_REASONS_QUERY,
      });
      expect(result).toBe(undefined);
      done();
    });
  });

  test('should call editScheduleCalendarReschedule correctly', (done) => {
    // Arrange
    const additionalCommentsMock = 'rabbit';
    const rescheduleDateMock = new Date('01-01-2025');
    const rescheduleReasonMock = 'Workload';
    const siteAuditIdMock = 100;
    const weekNumberMock = '01/2025';
    mockApollo.mutate = jest.fn().mockReturnValue(of({}));

    // Act
    service
      .editScheduleCalendarReschedule(
        additionalCommentsMock,
        rescheduleDateMock,
        rescheduleReasonMock,
        siteAuditIdMock,
        weekNumberMock,
      )
      .subscribe(() => {
        // Assert
        expect(mockApollo.mutate).toHaveBeenCalledWith({
          mutation: SCHEDULE_CALENDAR_RESCHEDULE_MUTATION,
          variables: {
            additionalComments: additionalCommentsMock,
            rescheduleDate: rescheduleDateMock,
            rescheduleReason: rescheduleReasonMock,
            siteAuditId: siteAuditIdMock,
            weekNumber: weekNumberMock,
          },
        });
        done();
      });
  });

  test('should call editScheduleCalendarConfirm correctly', (done) => {
    // Arrange
    mockApollo.mutate = jest.fn().mockReturnValue(of({}));

    // Act
    service.editScheduleCalendarConfirm(100).subscribe(() => {
      // Assert
      expect(mockApollo.mutate).toHaveBeenCalledWith({
        mutation: SCHEDULE_CALENDAR_CONFIRM_MUTATION,
        variables: {
          siteAuditId: 100,
        },
      });
      done();
    });
  });
});
