import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { SCHEDULE_LIST_SUPPORT } from '../../../constants';
import { ScheduleCalendarConfirmModalFooterComponent } from './schedule-calendar-confirm-modal-footer.component';

describe('ScheduleCalendarConfirmModalFooterComponent', () => {
  const mockDynamicDialogRef: Partial<DynamicDialogRef> = {
    close: jest.fn(),
  };
  let component: ScheduleCalendarConfirmModalFooterComponent;
  let mockDynamicDialogConfig: DynamicDialogConfig;
  beforeEach(() => {
    // Arrange
    mockDynamicDialogConfig = {
      data: { id: 111, location: 'rabbit' },
    };
    component = new ScheduleCalendarConfirmModalFooterComponent(
      mockDynamicDialogRef as DynamicDialogRef,
      mockDynamicDialogConfig as DynamicDialogConfig,
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
    // Act
    component.onRequestChanges();

    // Assert
    expect(mockDynamicDialogRef.close).toHaveBeenCalledWith({
      action: SCHEDULE_LIST_SUPPORT.RequestChanges,
      id: 111,
    });
  });
});
