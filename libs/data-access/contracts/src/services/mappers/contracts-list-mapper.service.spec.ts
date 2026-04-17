import {
  FilteringConfig,
  FilterMode,
  FilterOperator,
  GridFileActionType,
  mapFilterConfigToValues,
  utcDateToPayloadFormat,
} from '@customer-portal/shared';

import { ContractsExcelPayloadDto, ContractsListDto } from '../../dtos';
import { ContractsListItemModel } from '../../models';
import { ContractsListMapperService } from './contracts-list-mapper.service';

describe('ContractsListMapperService', () => {
  describe('mapToContractListItemModel', () => {
    test('should return an empty array when dto.data is null or undefined', () => {
      // Arrange
      const dtoWithDataNull: ContractsListDto = {
        data: null as unknown as [],
        isSuccess: true,
      };
      const dtoWithDataUndefined: ContractsListDto = {
        data: undefined as unknown as [],
        isSuccess: true,
      };

      // Act
      const resultWithDataNull =
        ContractsListMapperService.mapToContractListItemModel(dtoWithDataNull);
      const resultWithDataUndefined =
        ContractsListMapperService.mapToContractListItemModel(
          dtoWithDataUndefined,
        );

      // Assert
      expect(resultWithDataNull).toEqual([]);
      expect(resultWithDataUndefined).toEqual([]);
    });

    test('should map dto to model correctly', () => {
      // Arrange
      const dto: ContractsListDto = {
        data: [
          {
            contractId: '139544163',
            contractName: 'Test Document.docx',
            contractType: 'Contract',
            company: 'Mott MacDonald Limited',
            service: 'ISO 19443:2018',
            sites: 'Mott MacDonald Australia Pty Limited (Adelaide)',
            dateAdded: '2024-09-01T08:00:00Z',
          },
          {
            contractId: '1',
            contractName: 'Test Document 2.docx',
            contractType: 'Contract',
            company: 'Mott MacDonald Limited',
            service: 'ISO 37001:2016',
            sites: 'Mott MacDonald Private Limited (Bangalore)',
            dateAdded: '2024-09-01T08:00:00Z',
          },
        ],
        isSuccess: true,
      };

      const expected: ContractsListItemModel[] = [
        {
          contractId: '139544163',
          contractName: 'Test Document.docx',
          contractType: 'Contract',
          company: 'Mott MacDonald Limited',
          service: 'ISO 19443:2018',
          sites: 'Mott MacDonald Australia Pty Limited (Adelaide)',
          dateAdded: '01-09-2024',
          documentId: '139544163',
          fileName: 'Test Document.docx',
          actions: [
            {
              label: 'download',
              iconClass: 'pi-download',
              actionType: GridFileActionType.Download,
            },
          ],
        },
        {
          contractId: '1',
          contractName: 'Test Document 2.docx',
          contractType: 'Contract',
          company: 'Mott MacDonald Limited',
          service: 'ISO 37001:2016',
          sites: 'Mott MacDonald Private Limited (Bangalore)',
          dateAdded: '01-09-2024',
          documentId: '1',
          fileName: 'Test Document 2.docx',
          actions: [
            {
              label: 'download',
              iconClass: 'pi-download',
              actionType: GridFileActionType.Download,
            },
          ],
        },
      ];

      // Act
      const result = ContractsListMapperService.mapToContractListItemModel(dto);

      // Assert
      expect(result).toEqual(expected);
    });

    test('should correctly handle empty dto.data array', () => {
      // Arrange
      const dto: ContractsListDto = { data: [], isSuccess: true };

      // Act
      const result = ContractsListMapperService.mapToContractListItemModel(dto);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('mapToContractsExcelPayloadDto', () => {
    test('should map FilteringConfig to ContractsExcelPayloadDto', () => {
      // Arrange
      const mockedFilterConfig: FilteringConfig = {
        contractName: {
          value: [{ label: 'Test Contract', value: 'Test Contract' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        contractType: {
          value: [{ label: 'Type A', value: 'Type A' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        company: {
          value: [{ label: 'Test Company', value: 'Test Company' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        services: {
          value: [{ label: 'Test services', value: 'Test services' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        site: {
          value: [{ label: 'site 1', value: 'site 1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        dateAdded: {
          value: [
            { label: '2025-03-20T12:00:00Z', value: '2025-03-20T12:00:00Z' },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      const expectedPayload: ContractsExcelPayloadDto = {
        filters: {
          contractName: mapFilterConfigToValues(
            mockedFilterConfig,
            'contractName',
          ),
          contractType: mapFilterConfigToValues(
            mockedFilterConfig,
            'contractType',
          ),
          company: mapFilterConfigToValues(mockedFilterConfig, 'company'),
          service: mapFilterConfigToValues(mockedFilterConfig, 'services'),
          siteName: mapFilterConfigToValues(mockedFilterConfig, 'site'),
          dateAdded: mapFilterConfigToValues(
            mockedFilterConfig,
            'dateAdded',
            null,
            utcDateToPayloadFormat,
          ),
        },
      };

      // Act
      const result =
        ContractsListMapperService.mapToContractsExcelPayloadDto(
          mockedFilterConfig,
        );

      // Assert
      expect(result).toEqual(expectedPayload);
    });
  });
});
