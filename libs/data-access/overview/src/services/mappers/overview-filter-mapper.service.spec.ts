import { SharedSelectMultipleDatum } from '@customer-portal/shared';

import { OverviewFilterDataDto } from '../../dtos';
import { OverviewFilterMapperService } from './overview-filter-mapper.service';

describe('OverviewFilterMapperService', () => {
  describe('mapToOverviewFilterList', () => {
    test('should map OverviewFilterDataDto to SharedSelectMultipleDatum correctly', () => {
      // Arrange
      const mockData: OverviewFilterDataDto[] = [
        {
          id: 1,
          label: 'Rabbit',
        },
      ];
      const expected: SharedSelectMultipleDatum<number>[] = [
        {
          label: 'Rabbit',
          value: 1,
        },
      ];

      // Act
      const result =
        OverviewFilterMapperService.mapToOverviewFilterList(mockData);

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('mapToOverviewFilterTree', () => {
    test('should map OverviewFilterDataDto to TreeNode correctly', () => {
      // Arrange
      const mockDataA: OverviewFilterDataDto[] = [
        {
          id: 2,
          label: 'Fox',
          children: [
            {
              id: 3,
              label: 'Bear',
            },
          ],
        },
      ];
      const mockDataB: OverviewFilterDataDto[] = [
        {
          id: 4,
          label: 'Wolf',
          children: [],
        },
      ];
      const expectedA = [
        {
          data: 2,
          depth: 0,
          key: '2-Fox',
          label: 'Fox',
          children: [
            {
              data: 3,
              depth: 1,
              key: '3-Bear',
              label: 'Bear',
            },
          ],
        },
      ];
      const expectedB = [
        {
          data: 4,
          depth: 0,
          key: '4-Wolf',
          label: 'Wolf',
          children: undefined,
        },
      ];

      // Act
      const resultA =
        OverviewFilterMapperService.mapToOverviewFilterTree(mockDataA);
      const resultB =
        OverviewFilterMapperService.mapToOverviewFilterTree(mockDataB);

      // Assert
      expect(resultA).toEqual(expectedA);
      expect(resultB).toEqual(expectedB);
    });
  });
});
