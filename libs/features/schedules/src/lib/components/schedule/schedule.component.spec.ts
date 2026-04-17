import { SharedButtonToggleDatum } from '@customer-portal/shared';

import { ScheduleComponent } from './schedule.component';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;

  beforeEach(() => {
    component = new ScheduleComponent();
  });

  test('should create the component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  test('should have the correct page toggle options', () => {
    // Arrange
    const expectedOptions: Partial<SharedButtonToggleDatum<string>>[] = [
      {
        i18nKey: 'buttons.toggle.calendar',
        icon: 'calendar',
        label: 'Calendar',
        value: './',
      },
      {
        i18nKey: 'buttons.toggle.lists',
        icon: 'list',
        label: 'Lists',
        value: 'list',
      },
    ];

    // Act
    const actualOptions = component.pageToggleOptions;

    // Assert
    expect(actualOptions).toEqual(expectedOptions);
  });
});
