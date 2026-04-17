import { runInInjectionContext } from '@angular/core';

import { TrainingStatusStoreService } from '@customer-portal/data-access/overview';
import { createPreferenceMockInjector } from '@customer-portal/preferences';

import { OverviewTrainingStatusComponent } from './overview-training-status.component';

describe('OverviewTrainingStatusComponent', () => {
  let component: OverviewTrainingStatusComponent;
  const mockTrainingStatusStoreService: Partial<TrainingStatusStoreService> = {
    loadTrainingStatus: jest.fn(),
    redirectToLms: jest.fn(),
  };

  beforeEach(async () => {
    const injector = createPreferenceMockInjector();

    runInInjectionContext(injector, () => {
      component = new OverviewTrainingStatusComponent(
        mockTrainingStatusStoreService as TrainingStatusStoreService,
      );
    });
  });

  test('should handle ngOnInit correctly', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      mockTrainingStatusStoreService.loadTrainingStatus,
    ).toHaveBeenCalled();
  });

  test('should call redirectToLms with LMS_URL on button click', () => {
    // Act
    component.onButtonClick();

    // Arrange
    const LMS_URL =
      'https://ilearningdev.seertechsolutions.com.au/auth/oauth2/authorization/veracity';

    // Assert
    expect(mockTrainingStatusStoreService.redirectToLms).toHaveBeenCalledWith(
      LMS_URL,
    );
  });
});
