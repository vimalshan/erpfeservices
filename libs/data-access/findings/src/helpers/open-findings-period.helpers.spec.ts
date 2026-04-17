import { DateTime } from 'luxon';

import { OpenFindingsMonthsPeriod } from '../models';
import { getOpenFindingsDateRange } from './open-findings-period.helpers';

describe('open findings period helpers tests', () => {
  describe('getOpenFindingsDateRange', () => {
    let nowSpy: jest.SpyInstance;

    beforeEach(() => {
      nowSpy = jest
        .spyOn(DateTime, 'now')
        .mockReturnValue(
          DateTime.fromISO('2024-12-23T00:00:00Z').toUTC() as DateTime<true>,
        );
    });

    afterEach(() => {
      nowSpy.mockRestore();
    });

    test('should return correct date range for EarlyStage period', () => {
      // Arrange
      const period = OpenFindingsMonthsPeriod.EarlyStage;

      // Act
      const result = getOpenFindingsDateRange(period);

      // Assert
      const expectedStartDate = DateTime.fromISO(
        '2024-11-23T00:00:00Z',
      ).toJSDate();
      const expectedEndDate = DateTime.fromISO(
        '2024-12-23T00:00:00Z',
      ).toJSDate();
      expect(result.startDate).toEqual(expectedStartDate);
      expect(result.endDate).toEqual(expectedEndDate);
    });

    test('should return correct date range for InProgress period', () => {
      // Arrange
      const period = OpenFindingsMonthsPeriod.InProgress;

      // Act
      const result = getOpenFindingsDateRange(period);

      // Assert
      const expectedStartDate = DateTime.fromISO(
        '2024-10-24T00:00:00Z',
      ).toJSDate();
      const expectedEndDate = DateTime.fromISO(
        '2024-11-22T00:00:00Z',
      ).toJSDate();
      expect(result.startDate).toEqual(expectedStartDate);
      expect(result.endDate).toEqual(expectedEndDate);
    });

    test('should return correct date range for BecomingOverdue period', () => {
      // Arrange
      const period = OpenFindingsMonthsPeriod.BecomingOverdue;

      // Act
      const result = getOpenFindingsDateRange(period);

      // Assert
      const expectedStartDate = DateTime.fromISO(
        '2024-09-24T00:00:00Z',
      ).toJSDate();
      const expectedEndDate = DateTime.fromISO(
        '2024-10-23T00:00:00Z',
      ).toJSDate();
      expect(result.startDate).toEqual(expectedStartDate);
      expect(result.endDate).toEqual(expectedEndDate);
    });

    test('should return correct date range for Overdue period', () => {
      // Arrange
      const period = OpenFindingsMonthsPeriod.Overdue;

      // Act
      const result = getOpenFindingsDateRange(period);

      // Assert
      const expectedStartDate = new Date(0);
      const expectedEndDate = DateTime.fromISO(
        '2024-09-23T00:00:00Z',
      ).toJSDate();
      expect(result.startDate).toEqual(expectedStartDate);
      expect(result.endDate).toEqual(expectedEndDate);
    });

    test('should always calculate the end date correctly using endOffset', () => {
      // Arrange
      const period = OpenFindingsMonthsPeriod.BecomingOverdue;

      // Act
      const result = getOpenFindingsDateRange(period);

      // Assert
      const expectedEndDate = DateTime.fromISO(
        '2024-10-23T00:00:00Z',
      ).toJSDate();
      expect(result.endDate).toEqual(expectedEndDate);
    });
  });
});
