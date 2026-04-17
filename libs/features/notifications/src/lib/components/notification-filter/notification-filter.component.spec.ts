import {
  NotificationFilterKey,
  NotificationListStoreService,
} from '@customer-portal/data-access/notifications';

import { NotificationFilterComponent } from './notification-filter.component';

describe('NotificationFilterComponent', () => {
  let component: NotificationFilterComponent;
  let mockNotificationFilterStoreService: Partial<NotificationListStoreService>;

  beforeEach(() => {
    // Arrange
    mockNotificationFilterStoreService = {
      loadNotificationFilterList: jest.fn(),
      updateNotificationFilterByKey: jest.fn(),
    };

    component = new NotificationFilterComponent(
      mockNotificationFilterStoreService as NotificationListStoreService,
    );
  });

  test('should handle ngOnInit correctly', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      mockNotificationFilterStoreService.loadNotificationFilterList,
    ).toHaveBeenCalled();
  });

  test('should handle onFilterChange correctly', () => {
    // Act
    component.onFilterChange(null, NotificationFilterKey.Categories);

    // Assert
    expect(
      mockNotificationFilterStoreService.updateNotificationFilterByKey,
    ).toHaveBeenCalledWith(null, NotificationFilterKey.Categories);
  });
});
