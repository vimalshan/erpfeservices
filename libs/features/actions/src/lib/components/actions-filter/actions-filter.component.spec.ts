import {
  ActionFilterKey,
  ActionsListStoreService,
} from '@customer-portal/data-access/actions';

import { ActionsFilterComponent } from './actions-filter.component';

describe('ActionsFilterComponent', () => {
  let component: ActionsFilterComponent;
  let mockActionsDetailsStoreService: Partial<ActionsListStoreService>;

  beforeEach(() => {
    mockActionsDetailsStoreService = {
      loadActionsFilterList: jest.fn(),
      updateActionFilterByKey: jest.fn(),
    };

    component = new ActionsFilterComponent(
      mockActionsDetailsStoreService as ActionsListStoreService,
    );
  });

  test('should handle ngOnInit correctly', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      mockActionsDetailsStoreService.loadActionsFilterList,
    ).toHaveBeenCalled();
  });

  test('should handle onFilterChange correctly', () => {
    // Act
    component.onFilterChange(null, ActionFilterKey.Categories);

    // Assert
    expect(
      mockActionsDetailsStoreService.updateActionFilterByKey,
    ).toHaveBeenCalledWith(null, ActionFilterKey.Categories);
  });
});
