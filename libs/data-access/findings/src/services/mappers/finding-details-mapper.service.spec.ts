import { convertToUtcDate } from '@customer-portal/shared';

import {
  FindingDetailsDto,
  FindingResponsesDto,
  FindingResponsesPayloadDto,
  ManageFindingDetailsDto,
} from '../../dtos';
import { FindingResponsesModel } from '../../models';
import {
  FindingDetailsMapperService,
  SERVICES_DELIMITER,
} from './finding-details-mapper.service';

describe('FindingDetailsMapperService', () => {
  describe('mapToFindingDetailsModel', () => {
    test('should map DTOs to model correctly', () => {
      // Arrange
      const findingDetailsDto: FindingDetailsDto = {
        data: {
          findingNumber: '1',
          auditId: '123',
          auditors: ['John Doe'],
          auditType: 'Internal',
          openedDate: '2024-06-01',
          dueDate: '2024-07-01',
          closedDate: '2024-08-01',
          acceptedDate: '2024-09-01',
          services: ['Service 1', 'Service 2'],
          sites: [
            {
              siteName: 'Test Site',
              siteAddress: 'Test City',
            },
          ],
          status: 'Open',
        },
        isSuccess: true,
      };

      const manageFindingDetailsDto: ManageFindingDetailsDto = {
        data: {
          category: 'Category 1',
          clauses: ['Clause 1'],
          descriptionInPrimaryLanguage: 'Primary Language Description',
          descriptionInSecondaryLanguage: 'Secondary Language Description',
          primaryLanguage: 'English',
          secondaryLanguage: 'French',
          titleInPrimaryLanguage: 'Primary Title',
          titleInSecondaryLanguage: 'Secondary Title',
          focusAreas: [
            {
              focusAreaInPrimaryLanguage: 'Primary Focus Area',
              focusAreaInSecondaryLanguage: 'Secondary Focus Area',
            },
          ],
        },
        isSuccess: true,
      };

      // Act
      const result = FindingDetailsMapperService.mapToFindingDetailsModel(
        findingDetailsDto,
        manageFindingDetailsDto,
      );

      // Assert
      expect(result).toEqual({
        findingNumber: '1',
        header: {
          auditNumber: '123',
          site: 'Test Site',
          city: 'Test City',
          openDate: '01.06.2024',
          dueDate: '01.07.2024',
          closeDate: '01.08.2024',
          acceptedDate: '01.09.2024',
          auditor: 'John Doe',
          auditType: 'Internal',
          services: `Service 1${SERVICES_DELIMITER}Service 2`,
          status: 'Open',
        },
        primaryLanguageDescription: {
          category: 'Category 1',
          description: 'Primary Language Description',
          clause: 'Clause 1',
          focusArea: 'Primary Focus Area',
          language: 'English',
          isPrimaryLanguage: true,
          isSelected: true,
          title: 'Primary Title',
        },
        secondaryLanguageDescription: {
          category: 'Category 1',
          description: 'Secondary Language Description',
          clause: 'Clause 1',
          focusArea: 'Secondary Focus Area',
          language: 'French',
          isPrimaryLanguage: false,
          isSelected: false,
          title: 'Secondary Title',
        },
      });
    });

    test('should handle missing clauses, focus areas, services and sites in ManageFindingDetailsDto', () => {
      // Arrange
      const findingDetailsDto: FindingDetailsDto = {
        data: {
          findingNumber: '2',
          auditId: '124',
          auditors: ['Jane Doe'],
          auditType: 'External',
          openedDate: '2023-05-01',
          dueDate: '2023-06-01',
          closedDate: '2023-07-01',
          acceptedDate: '2023-08-01',
          services: null as any,
          sites: null as any,
          status: 'Closed',
        },
        isSuccess: true,
      };

      const manageFindingDetailsDto: ManageFindingDetailsDto = {
        data: {
          category: 'Category 2',
          clauses: [],
          descriptionInPrimaryLanguage: 'Description in Primary Language',
          descriptionInSecondaryLanguage: 'Description in Secondary Language',
          primaryLanguage: 'Spanish',
          secondaryLanguage: 'German',
          titleInPrimaryLanguage: 'Primary Title',
          titleInSecondaryLanguage: 'Secondary Title',
          focusAreas: [],
        },
        isSuccess: true,
      };

      // Act
      const result = FindingDetailsMapperService.mapToFindingDetailsModel(
        findingDetailsDto,
        manageFindingDetailsDto,
      )!;

      // Assert
      expect(result.primaryLanguageDescription.clause).toBe('');
      expect(result.primaryLanguageDescription.focusArea).toBe('');
      expect(result.secondaryLanguageDescription.clause).toBe('');
      expect(result.secondaryLanguageDescription.focusArea).toBe('');
      expect(result.header.services).toBe('');
      expect(result.header.site).toBe('');
      expect(result.header.city).toBe('');
    });

    test('should handle null ManageFindingDetailsDto', () => {
      // Arrange
      const findingDetailsDto: FindingDetailsDto = {
        data: {
          findingNumber: '4',
          auditId: '126',
          auditors: ['Auditor 4'],
          auditType: 'Risk Assessment',
          openedDate: '2025-01-01',
          dueDate: '2025-02-01',
          closedDate: '2025-03-01',
          acceptedDate: '2025-04-01',
          services: ['Risk Service'],
          sites: [
            {
              siteName: 'Risk Site',
              siteAddress: 'Risk City',
            },
          ],
          status: 'Open',
        },
        isSuccess: true,
      };

      const manageFindingDetailsDto = null;

      // Act
      const result = FindingDetailsMapperService.mapToFindingDetailsModel(
        findingDetailsDto,
        manageFindingDetailsDto as unknown as ManageFindingDetailsDto,
      );

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('mapToFindingResponsesPayloadDto', () => {
    const baseFormValue = {
      nonConformity: 'Non-conformity text',
      rootCause: 'Root cause explanation',
      correctionAction: 'Corrective action steps',
    };

    test('should return payload with responseId when isSubmit is true', () => {
      // Arrange
      const model: FindingResponsesModel = {
        isSubmit: true,
        formValue: baseFormValue,
      };

      // Act
      const result =
        FindingDetailsMapperService.mapToFindingResponsesPayloadDto(
          model,
          'FN-001',
          'RESP-123',
        );

      // Assert
      const expected: FindingResponsesPayloadDto = {
        request: {
          findingNumber: 'FN-001',
          responseId: 'RESP-123',
          isSubmitToDnv: true,
          rootCause: baseFormValue.rootCause,
          correctiveAction: baseFormValue.correctionAction,
          correction: baseFormValue.nonConformity,
        },
      };
      expect(result).toEqual(expected);
    });

    test('should return payload with responseId = null when isSubmit is false', () => {
      // Arrange
      const model: FindingResponsesModel = {
        isSubmit: false,
        formValue: baseFormValue,
      };

      // Act
      const result =
        FindingDetailsMapperService.mapToFindingResponsesPayloadDto(
          model,
          'FN-002',
          'RESP-456',
        );

      // Assert
      const expected: FindingResponsesPayloadDto = {
        request: {
          findingNumber: 'FN-002',
          responseId: null,
          isSubmitToDnv: false,
          rootCause: baseFormValue.rootCause,
          correctiveAction: baseFormValue.correctionAction,
          correction: baseFormValue.nonConformity,
        },
      };

      expect(result).toEqual(expected);
    });
  });

  describe('mapToFindingResponsesModel', () => {
    test('should return null when data is not present in dto', () => {
      // Arrange
      const dto: any = { data: null };

      // Act
      const result =
        FindingDetailsMapperService.mapToFindingResponsesModel(dto);

      // Assert
      expect(result).toBeNull();
    });

    test('should correctly map dto to FindingResponsesModel', () => {
      // Arrange
      const dto: FindingResponsesDto = {
        data: {
          correctiveAction: 'Corrective Action',
          correction: 'Non Conformity',
          rootCause: 'Root Cause',
          isSubmitToDnv: true,
          updatedOn: '2021-01-01T00:00:00Z',
          isDraft: false,
          respondId: 1,
        },
        isSuccess: true,
      };

      const expectedModel: FindingResponsesModel = {
        formValue: {
          correctionAction: 'Corrective Action',
          nonConformity: 'Non Conformity',
          rootCause: 'Root Cause',
        },
        isSubmit: true,
        createdOn: '01.01.2021',
        isDraft: false,
        respondId: '1',
      };

      // Act
      const result =
        FindingDetailsMapperService.mapToFindingResponsesModel(dto);

      // Assert
      expect(result).toEqual(expectedModel);
    });

    test('should handle empty strings in dto correctly', () => {
      // Arrange
      const dto: FindingResponsesDto = {
        data: {
          correctiveAction: '',
          correction: '',
          rootCause: '',
          isSubmitToDnv: false,
          updatedOn: '',
          isDraft: false,
          respondId: 0,
        },
        isSuccess: true,
      };

      const expectedModel: FindingResponsesModel = {
        formValue: {
          correctionAction: '',
          nonConformity: '',
          rootCause: '',
        },
        isSubmit: false,
        createdOn: convertToUtcDate(''),
        isDraft: false,
        respondId: '',
      };

      // Act
      const result =
        FindingDetailsMapperService.mapToFindingResponsesModel(dto);

      // Assert
      expect(result).toEqual(expectedModel);
    });

    test('should handle null values in dto correctly', () => {
      // Arrange
      const dto: any = {
        data: {
          correctiveAction: null,
          correction: null,
          rootCause: null,
          isSubmitToDnv: null,
          createdOn: null,
          isDraft: null,
          respondId: null,
        },
        isSuccess: false,
      };

      const expectedModel = {
        formValue: {
          correctionAction: null,
          nonConformity: null,
          rootCause: null,
        },
        isSubmit: null,
        isDraft: null,
        respondId: '',
        createdOn: convertToUtcDate(''),
      };

      // Act
      const result =
        FindingDetailsMapperService.mapToFindingResponsesModel(dto);

      // Assert
      expect(result).toEqual(expectedModel);
    });
  });
});
