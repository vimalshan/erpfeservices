import { TimeRange } from '../../models';

const getMonthCurrent = () => new Date().getUTCMonth();

const getYearCurrent = () => new Date().getUTCFullYear();

export const getCurrentYearRange = (): { startOfYear: Date; endOfYear: Date } => ({
  startOfYear: new Date(Date.UTC(getYearCurrent(), 0, 1)),
  endOfYear: new Date(Date.UTC(getYearCurrent(), 11, 31, 23, 59, 59, 999)),
});

export const getCurrentYearMinus5Range = (): { startOfYear: Date; endOfYear: Date } => ({
  startOfYear: new Date(Date.UTC(getYearCurrent() - 5, 0, 1)),
  endOfYear: new Date(Date.UTC(getYearCurrent(), 11, 31, 23, 59, 59, 999)),
});

export const getTimeRange = (range: TimeRange) => {
  const date = new Date().setUTCHours(0, 0, 0);

  switch (range) {
    case TimeRange.MonthPrevious:
      return [
        new Date(new Date(date).setUTCMonth(getMonthCurrent() - 1, 1)),
        new Date(new Date(date).setUTCMonth(getMonthCurrent(), 0)),
      ];
    case TimeRange.MonthCurrent:
      return [
        new Date(new Date(date).setUTCMonth(getMonthCurrent(), 1)),
        new Date(new Date(date).setUTCMonth(getMonthCurrent() + 1, 0)),
      ];
    case TimeRange.MonthNext:
      return [
        new Date(new Date(date).setUTCMonth(getMonthCurrent() + 1, 1)),
        new Date(new Date(date).setUTCMonth(getMonthCurrent() + 2, 0)),
      ];
    case TimeRange.YearPrevious:
      return [
        new Date(new Date(date).setUTCFullYear(getYearCurrent() - 1, 0, 1)),
        new Date(new Date(date).setUTCFullYear(getYearCurrent(), 0, 0)),
      ];
    case TimeRange.YearCurrent:
      return [
        new Date(new Date(date).setUTCFullYear(getYearCurrent(), 0, 1)),
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 1, 0, 0)),
      ];
    case TimeRange.YearNext:
      return [
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 1, 0, 1)),
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 2, 0, 0)),
      ];
    case TimeRange.YearCustom:
      return [
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 1 - 4, 0, 1)),
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 2 - 1, 0, 0)),
      ];
    case TimeRange.YearCustom5Years:
      return [
        new Date(new Date(date).setUTCFullYear(getYearCurrent() - 5, 0, 1)),
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 1, 0, 0)),
      ];
    case TimeRange.Custom:
      return [
        new Date(new Date(date).setUTCFullYear(getYearCurrent() - 3, 0, 1)),
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 1, 0, 0)),
      ];
    default:
      return [];
  }
};

export const getTimeModRange = (range: TimeRange): [Date, Date] => {
  const result = getTimeRange(range);
  if (result.length >= 2) {
    return [result[0], result[1]];
  }
  const now = new Date();
  return [now, now];
};

export const toUtcRange = (range: Date[]): [Date, Date] => {
  if (!range || range.length < 2) {
    const now = new Date();
    return [now, now];
  }
  const start = new Date(Date.UTC(
    range[0].getFullYear(), range[0].getMonth(), range[0].getDate(), 0, 0, 0, 0,
  ));
  const end = new Date(Date.UTC(
    range[1].getFullYear(), range[1].getMonth(), range[1].getDate(), 23, 59, 59, 999,
  ));
  return [start, end];
};
