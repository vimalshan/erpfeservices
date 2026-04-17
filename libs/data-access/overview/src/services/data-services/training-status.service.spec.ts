import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { TrainingStatusGraphResponseDto } from '../../dtos';
import { TrainingStatusModel } from '../../models';
import { TrainingStatusService } from './training-status.service';

describe('TrainingStatusService', () => {
  let trainingStatusService: TrainingStatusService;

  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  beforeEach(() => {
    trainingStatusService = new TrainingStatusService(apolloMock as Apollo);
  });

  test('should fetch and map training-status-list', () => {
    // Arrange
    const trainingStatusList: TrainingStatusModel[] = [
      {
        trainingName: 'ISMS 27001:2022 LA Training',
        status: 'In progress',
        dueDate: '11.09.2024',
        location: 'Manchester, UK',
        imageUrl: 'assets/external-apps/boostAudit.png',
      },
      {
        trainingName: 'ISO 9005 Accessing services',
        status: 'Enrolled',
        dueDate: '19.10.2024',
        location: 'London, UK',
        imageUrl: 'assets/external-apps/boostAudit.png',
      },
      {
        trainingName: 'ISO 9005 Accessing services',
        status: 'Enrolled',
        dueDate: '19.10.2024',
        location: 'Manchester, US',
        imageUrl: 'assets/external-apps/boostAudit.png',
      },
    ];

    apolloMock.query = jest.fn().mockReturnValue(of(trainingStatusList));

    // Act
    trainingStatusService
      .getTrainingStatusList()
      .subscribe((result: TrainingStatusGraphResponseDto) => {
        // Assert
        expect(result).toEqual(trainingStatusList);
      });
  });
});
