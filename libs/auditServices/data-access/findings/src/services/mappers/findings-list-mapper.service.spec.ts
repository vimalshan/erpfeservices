import { FindingExcelPayloadDto } from '../../dtos';
import { FindingListDto } from '../../dtos/finding-list.dto';
import { FindingListItemModel } from '../../models';
import { FindingsListMapperService } from './findings-list-mapper.service';
import {
  mapToFindingExcelPayloadDtoExpectedFilters,
  mapToFindingExcelPayloadDtoFilterConfig,
  mapToFindingItemModelDTO,
  mapToFindingItemModelEmptyServiceDTO,
  mapToFindingItemModelEmptyServiceExpected,
  mapToFindingItemModelExpected,
} from './findings-list-mapper.service.mock';

describe('FindingsListMapperService', () => {
  describe('mapToFindingItemModel', () => {
    test('it should map DTO to FindingListItemModel correctly', () => {
      // Arrange

      // Act
      const result = FindingsListMapperService.mapToFindingItemModel(
        mapToFindingItemModelDTO,
      );

      // Assert
      expect(result).toEqual(mapToFindingItemModelExpected);
    });

    test('it should handle empty services correctly', () => {
      // Arrange

      // Act
      const result = FindingsListMapperService.mapToFindingItemModel(
        mapToFindingItemModelEmptyServiceDTO,
      );

      // Assert
      expect(result).toEqual(mapToFindingItemModelEmptyServiceExpected);
    });

    test('should return empty array when DTO data is empty', () => {
      // Arrange
      const dto: FindingListDto = { data: [] };
      const expected: FindingListItemModel[] = [];

      // Act
      const result = FindingsListMapperService.mapToFindingItemModel(dto);

      // Assert
      expect(result).toEqual(expected);
    });

    test('should return empty array when DTO is empty', () => {
      // Arrange
      const dto = {};
      const expected: FindingListItemModel[] = [];

      // Act
      const result = FindingsListMapperService.mapToFindingItemModel(
        dto as unknown as FindingListDto,
      );

      // Assert
      expect(result).toEqual(expected);
    });

    test('should return empty array when DTO is null', () => {
      // Arrange
      const dto = null;
      const expected: FindingListItemModel[] = [];

      // Act
      const result = FindingsListMapperService.mapToFindingItemModel(
        dto as unknown as FindingListDto,
      );

      // Assert
      expect(result).toEqual(expected);
    });

    test('should return empty array when DTO is undefined', () => {
      // Arrange
      const dto = undefined;
      const expected: FindingListItemModel[] = [];

      // Act
      const result = FindingsListMapperService.mapToFindingItemModel(
        dto as unknown as FindingListDto,
      );

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('mapToFindingExcelPayloadDto', () => {
    test('should map filter config and contact ID to FindingExcelPayloadDto', () => {
      // Arrange

      // Act
      const result: FindingExcelPayloadDto =
        FindingsListMapperService.mapToFindingExcelPayloadDto(
          mapToFindingExcelPayloadDtoFilterConfig,
        );

      // Assert
      expect(result).toEqual(mapToFindingExcelPayloadDtoExpectedFilters);
    });
  });
});
