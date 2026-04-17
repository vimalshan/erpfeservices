import { FindingResponseHistoryDto } from '../../dtos';
import { FindingResponseHistoryMapperService } from './finding-response-history-mapper.service';

describe('FindingResponseHistoryMapperService', () => {
  beforeAll(() => {
    const originalDateResolvedOptions =
      new Intl.DateTimeFormat().resolvedOptions();
    jest
      .spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
      .mockReturnValue({
        ...originalDateResolvedOptions,
        timeZone: 'Australia/Melbourne',
      });
  });

  test('should map DTO to model correctly', () => {
    // Arrange
    const dto: FindingResponseHistoryDto = {
      data: [
        {
          auditorComments: [
            {
              updatedOn: '2024-05-01T15:44:00.000+02:00',
              updatedBy: 'Arne Arnesson',
              commentsInPrimaryLanguage:
                'Please provide a better explanation of the root cause.',
              commentsInSecondaryLanguage: '',
              responseCommentId: 11,
            },
          ],
          previousResponse: {
            updatedBy: 'Marq Sanches',
            correctionInPrimaryLanguage: 'Correction',
            correctionInSecondaryLanguage: '',
            rootCauseInPrimaryLanguage: 'Root Cause',
            rootCauseInSecondaryLanguage: '',
            correctiveActionInPrimaryLanguage: 'Corrective Action',
            correctiveActionInSecondaryLanguage: '',
            responseId: 22,
            updatedOn: '2024-05-01T11:23:00.000+00:00',
          },
        },
        {
          auditorComments: [],
          previousResponse: {
            updatedBy: 'Marq Sanches',
            correctionInPrimaryLanguage: 'Correction',
            correctionInSecondaryLanguage: '',
            rootCauseInPrimaryLanguage: 'Root Cause',
            rootCauseInSecondaryLanguage: '',
            correctiveActionInPrimaryLanguage: 'Corrective Action',
            correctiveActionInSecondaryLanguage: '',
            responseId: 22,
            updatedOn: '2024-05-01T21:37:00.000+03:00',
          },
        },
      ],
    };

    // Act
    const result =
      FindingResponseHistoryMapperService.mapToFindingResponseHistoryModel(dto);

    // Assert
    expect(result).toEqual([
      {
        userName: 'Marq Sanches',
        isAuditor: false,
        responseDateTime: '01.05.2024 21:23',
        rootCause: 'Root Cause',
        correctiveAction: 'Corrective Action',
        correction: 'Correction',
      },
      {
        userName: 'DNV | Arne Arnesson',
        isAuditor: true,
        responseDateTime: '01.05.2024 23:44',
        auditorComment:
          'Please provide a better explanation of the root cause.',
      },
      {
        userName: 'Marq Sanches',
        isAuditor: false,
        responseDateTime: '02.05.2024 04:37',
        rootCause: 'Root Cause',
        correctiveAction: 'Corrective Action',
        correction: 'Correction',
      },
    ]);
  });
});
