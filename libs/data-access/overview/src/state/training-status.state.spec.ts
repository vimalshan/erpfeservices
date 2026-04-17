import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import {
  getToastContentBySeverity,
  ToastSeverity,
} from '@customer-portal/shared';

import { TrainingStatusGraphResponseDto } from '../dtos';
import { TrainingStatusModel } from '../models';
import { TrainingStatusService } from '../services';
import {
  LoadTrainingStatus,
  RedirectToLms,
} from './actions/training-status.actions';
import { TrainingStatusState } from './training-status.state';

describe('TrainingStatusState', () => {
  let store: Store;
  let messageServiceMock: Partial<MessageService>;
  const trainingStatusServiceMock = {
    getTrainingStatusList: jest.fn(),
  };

  beforeEach(() => {
    messageServiceMock = {
      add: jest.fn(),
    };
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([TrainingStatusState])],
      providers: [
        {
          provide: TrainingStatusService,
          useValue: trainingStatusServiceMock,
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
      ],
    });

    store = TestBed.inject(Store);
  });

  test('should load and transform training-status-list into state', async () => {
    // Arrange
    const mockedTrainingStatusListResponse: TrainingStatusGraphResponseDto = {
      isSuccess: true,
      data: {
        trainingData: [
          {
            trainingName: 'ISMS 27001:2022 LA Training',
            trainingStatus: 'In progress',
            trainingDueDate: '11.09.2024',
            trainingLocation: 'Manchester, UK',
          },
          {
            trainingName: 'ISO 9005 Accessing services',
            trainingStatus: 'Enrolled',
            trainingDueDate: '19.10.2024',
            trainingLocation: 'London, UK',
          },
          {
            trainingName: 'ISO 9005 Accessing services',
            trainingStatus: 'Enrolled',
            trainingDueDate: '19.10.2024',
            trainingLocation: 'Manchester, US',
          },
        ],
      },
    };

    const expectedTrainingStatusList: TrainingStatusModel[] = [
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

    jest
      .spyOn(trainingStatusServiceMock, 'getTrainingStatusList')
      .mockReturnValue(of(mockedTrainingStatusListResponse));

    // Act
    store.dispatch(new LoadTrainingStatus());

    const actualTrainingStatusListInState = store.selectSnapshot(
      (state) => state.TrainingStatus.trainings,
    );

    // Assert
    expect(actualTrainingStatusListInState).toEqual(expectedTrainingStatusList);
  });

  test('should open URL in new tab when RedirectToLms is dispatched with a valid URL', () => {
    // Arrange
    const url =
      'https://ilearningdev.seertechsolutions.com.au/auth/oauth2/authorization/veracity';
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    // Act
    store.dispatch(new RedirectToLms(url));

    // Assert
    expect(openSpy).toHaveBeenCalledWith(url, '_blank');

    openSpy.mockRestore();
  });

  test('should show error message when RedirectToLms is dispatched without a URL', () => {
    // Act
    store.dispatch(new RedirectToLms(''));

    // Assert
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      getToastContentBySeverity(ToastSeverity.SomethingWentWrong),
    );
  });
});
