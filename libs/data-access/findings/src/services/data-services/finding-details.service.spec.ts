import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import {
  FindingDetailsDto,
  FindingResponsesDto,
  FindingResponsesPayloadDto,
  ManageFindingDetailsDto,
} from '../../dtos';
import {
  FINDING_DETAILS_QUERY,
  LATEST_FINDING_RESPONSES_QUERY,
  MANAGE_FINDING_DETAILS_QUERY,
  RESPOND_TO_FINDINGS_MUTATION,
} from '../../graphql';
import { FindingDetailsService } from './finding-details.service';

describe('FindingDetailsService', () => {
  let service: FindingDetailsService;
  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
    mutate: jest.fn(),
  };

  beforeEach(() => {
    service = new FindingDetailsService(apolloMock as Apollo);
  });

  describe('FindingDetailsService', () => {
    test('should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('getFindingDetails', () => {
      test('should fetch and map findings details data', (done) => {
        // Arrange
        const findingNumber = 'findings-id';
        const viewFindingDetails: FindingDetailsDto = {
          data: {
            findingNumber,
            status: 'Open',
            auditors: ['Auditor'],
            services: ['IFS Food version 8 April 2023', 'FSC-STD-40-004 V3-1'],
            sites: [
              {
                siteName: 'DNV GL GSS IT',
                siteAddress: 'Arnhem',
              },
            ],
            auditId: '3067486',
            openedDate: '2024-05-18',
            dueDate: '2024-06-18',
            closedDate: '2024-07-18',
            acceptedDate: '2024-08-18',
            auditType: 'CAT1 (major)',
          },
          isSuccess: true,
        };

        apolloMock.query = jest.fn().mockReturnValueOnce(
          of({
            data: {
              viewFindingDetails,
            },
          }),
        );

        // Act
        service.getFindingDetails(findingNumber).subscribe((result) => {
          // Assert
          expect(apolloMock.query).toHaveBeenCalledWith({
            query: FINDING_DETAILS_QUERY,
            variables: {
              findingNumber,
            },
          });
          expect(result).toBe(viewFindingDetails);
          done();
        });
      });
    });

    describe('getManageFindingDetails', () => {
      test('should fetch and map manage finding details data', (done) => {
        // Arrange
        const findingNumber = 'findings-id';
        const viewManageFinding: ManageFindingDetailsDto = {
          data: {
            category: 'CAT1 - Major',
            clauses: ['Clause'],
            descriptionInPrimaryLanguage: 'Description in English',
            descriptionInSecondaryLanguage: 'Description in Norwegian',
            primaryLanguage: 'English',
            secondaryLanguage: 'Norwegian',
            titleInPrimaryLanguage: 'Title in English',
            titleInSecondaryLanguage: 'Title in Norwegian',
            focusAreas: [
              {
                focusAreaInPrimaryLanguage: 'Focus Area in English',
                focusAreaInSecondaryLanguage: 'Focus Area in Norwegian',
              },
            ],
          },
          isSuccess: true,
        };

        apolloMock.query = jest.fn().mockReturnValueOnce(
          of({
            data: {
              viewManageFinding,
            },
          }),
        );

        // Act
        service.getManageFindingDetails(findingNumber).subscribe((result) => {
          // Assert
          expect(apolloMock.query).toHaveBeenCalledWith({
            query: MANAGE_FINDING_DETAILS_QUERY,
            variables: {
              findingNumber,
            },
          });
          expect(result).toBe(viewManageFinding);
          done();
        });
      });
    });

    describe('respondToFindings', () => {
      test('should call apollo.mutate with the correct parameters', (done) => {
        // Arrange
        const payload: FindingResponsesPayloadDto = {
          request: {
            findingNumber: 'finding-id',
            responseId: '1',
            correction: 'test correction',
            correctiveAction: 'test correctiveAction',
            rootCause: 'test rootCause',
            isSubmitToDnv: true,
          },
        };
        const { request } = payload;

        apolloMock.mutate = jest.fn().mockReturnValueOnce(of({}));

        // Act
        service.respondToFindings(payload).subscribe((result) => {
          // Assert
          expect(apolloMock.mutate).toHaveBeenCalledWith({
            mutation: RESPOND_TO_FINDINGS_MUTATION,
            variables: {
              request,
            },
          });
          expect(result).toStrictEqual({});
          done();
        });
      });
    });

    describe('getLatestFindingResponses', () => {
      test('should call apollo.query with the correct parameters and return the expected data', (done) => {
        // Arrange
        const findingNumber = 'findingNumber';
        const latestFindingResponse: FindingResponsesDto = {
          data: {
            correction: 'test correction',
            correctiveAction: 'test correctiveAction',
            updatedOn: '06-04-2024',
            rootCause: 'test rootCause',
            isSubmitToDnv: true,
            isDraft: false,
            respondId: 1,
          },
          isSuccess: true,
        };

        apolloMock.query = jest.fn().mockReturnValueOnce(
          of({
            data: {
              getLatestFindingResponse: latestFindingResponse,
            },
          }),
        );

        // Act
        service.getLatestFindingResponses(findingNumber).subscribe((result) => {
          // Assert
          expect(apolloMock.query).toHaveBeenCalledWith({
            query: LATEST_FINDING_RESPONSES_QUERY,
            variables: {
              findingNumber,
            },
            fetchPolicy: 'no-cache',
          });
          expect(result).toStrictEqual(latestFindingResponse);
          done();
        });
      });
    });
  });
});
