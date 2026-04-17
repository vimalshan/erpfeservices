import { signal, WritableSignal } from '@angular/core';

import { CalendarScheduleModel, CalendarScheduleParams } from '../models';

export const createCalendarScheduleStoreServiceMock = () => {
  const mockCalendarSchedule: WritableSignal<CalendarScheduleModel[]> = signal(
    [],
  );
  const mockCalendarIsPreferenceSet: WritableSignal<boolean> = signal(false);

  return {
    get calendarSchedule() {
      return mockCalendarSchedule;
    },
    get calendarIsPreferenceSet() {
      return mockCalendarIsPreferenceSet;
    },
    loadCalendarSchedule: jest.fn((params?: CalendarScheduleParams) => ({
      type: '[Calendar] Load Calendar Schedule',
      params,
    })),
    updateCalendarSchedulePreferenceSet: jest.fn(
      (isPreferenceSet: boolean) => ({
        type: '[Calendar] Update Calendar Schedule Preference Set',
        isPreferenceSet,
      }),
    ),
  };
};
