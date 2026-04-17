import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { FindingResponseHistoryDto } from '../../dtos';
import { FINDING_RESPONSE_HISTORY_QUERY } from '../../graphql';
import { FindingResponseHistoryService } from './finding-response-history.service';

describe('FindingResponseHistoryService', () => {
  let service: FindingResponseHistoryService;

  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
    mutate: jest.fn(),
  };

  beforeEach(() => {
    service = new FindingResponseHistoryService(apolloMock as Apollo);
  });

  describe('FindingResponseHistoryService', () => {
    test('it should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getFindingResponseHistory', () => {
    test('should call Apollo client with correct parameters', (done) => {
      // Arrange
      const findingNumber = 'finding1';

      const viewPreviousResponses: FindingResponseHistoryDto = {
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

      apolloMock.query = jest.fn().mockReturnValueOnce(
        of({
          data: {
            viewPreviousResponses,
          },
        }),
      );

      // Act
      service.getFindingResponseHistory(findingNumber).subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: FINDING_RESPONSE_HISTORY_QUERY,
          variables: {
            findingNumber,
          },
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(viewPreviousResponses);
        done();
      });
    });
  });
});
