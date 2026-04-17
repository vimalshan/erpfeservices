import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';

import { SCHEDULE_LIST_SUPPORT } from '../../../constants';
import { ScheduleCalendarRescheduleModalFooterComponent } from './schedule-calendar-reschedule-modal-footer.component';

describe('ScheduleCalendarRescheduleModalFooterComponent', () => {
  let component: ScheduleCalendarRescheduleModalFooterComponent;
  let mockDynamicDialogConfig: DynamicDialogConfig;
  let mockDynamicDialogRef: Partial<DynamicDialogRef>;
  let formValidBehaviorSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    // Arrange
    formValidBehaviorSubject = new BehaviorSubject<boolean>(false);
    mockDynamicDialogConfig = {
      data: { formValid: formValidBehaviorSubject, id: 123 },
    } as DynamicDialogConfig;
    mockDynamicDialogRef = {
      close: jest.fn(),
    };

    component = new ScheduleCalendarRescheduleModalFooterComponent(
      mockDynamicDialogConfig,
      mockDynamicDialogRef as DynamicDialogRef,
    );
  });

  test('should handle onCancel correctly', () => {
    // Act
    component.onCancel();

    // Assert
    expect(mockDynamicDialogRef.close).toHaveBeenCalledWith(false);
  });

  test('should handle onSubmit correctly', () => {
    // Act
    component.onSubmit();

    // Assert
    expect(mockDynamicDialogRef.close).toHaveBeenCalledWith(true);
  });

  test('should handle onRequestChanges correctly', () => {
    // Arrange
    const expectedRequestChanges = {
      action: SCHEDULE_LIST_SUPPORT.RequestChanges,
      id: 123,
    };

    // Act
    component.onRequestChanges();

    // Assert
    expect(mockDynamicDialogRef.close).toHaveBeenCalledWith(
      expectedRequestChanges,
    );
  });
});
