import { OverviewCardsDto } from '../../dtos';
import { OverviewMapperService } from './overview-mapper.service';

describe('OverviewMapperService', () => {
  describe('mapToOverviewCardModel', () => {
    test('should map dto to CardDataModel[] correctly', () => {
      // Arrange
      const mockDto: OverviewCardsDto = {
        currentPage: 1,
        totalItems: 1,
        totalPages: 1,
        data: [
          {
            serviceName: 'ISO 9001:2015',
            yearData: [
              {
                year: 2024,
                values: [
                  {
                    count: 5,
                    seq: 1,
                    statusValue: 'Confirmed',
                    totalCount: 10,
                  },
                  {
                    count: 3,
                    seq: 2,
                    statusValue: 'Completed',
                    totalCount: 6,
                  },
                ],
              },
            ],
          },
        ],
      };

      // Act
      const result = OverviewMapperService.mapToOverviewCardModel(mockDto);

      // Assert
      expect(result).toEqual([
        {
          cardData: {
            service: 'ISO 9001:2015',
            yearlyData: [
              {
                year: {
                  label: '2024',
                  index: 0,
                },
                details: [
                  {
                    entity: 'Schedule',
                    entityTranslationKey: 'overview.cardTexts.schedule',
                    stats: {
                      currentValue: 5,
                      maxValue: 10,
                      percentage: 50,
                    },
                  },
                  {
                    entity: 'Audit',
                    entityTranslationKey: 'overview.cardTexts.audits',
                    stats: {
                      currentValue: 3,
                      maxValue: 6,
                      percentage: 50,
                    },
                  },
                ],
              },
            ],
          },
        },
      ]);
    });

    test('should return null if dto is invalid or empty', () => {
      // Assert
      expect(
        OverviewMapperService.mapToOverviewCardModel(null as any),
      ).toBeNull();
      expect(
        OverviewMapperService.mapToOverviewCardModel({} as any),
      ).toBeNull();
      expect(
        OverviewMapperService.mapToOverviewCardModel({
          currentPage: 0,
          totalItems: 0,
          totalPages: 0,
          data: [],
        }),
      ).toBeNull();
    });
  });

  describe('mapToPageInfo', () => {
    test('should return correct page info from a valid dto', () => {
      // Arrange
      const mockDto: OverviewCardsDto = {
        currentPage: 2,
        totalItems: 20,
        totalPages: 5,
        data: [
          {
            serviceName: 'ISO XYZ',
            yearData: [],
          },
        ],
      };

      // Act
      const result = OverviewMapperService.mapToPageInfo(mockDto);

      // Assert
      expect(result).toEqual({
        currentPage: 2,
        totalItems: 20,
        totalPages: 5,
      });
    });

    test('should return zeros if dto is null or has empty data', () => {
      // Assert
      expect(OverviewMapperService.mapToPageInfo(null as any)).toEqual({
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
      });

      expect(
        OverviewMapperService.mapToPageInfo({
          currentPage: 0,
          totalItems: 0,
          totalPages: 0,
          data: [],
        }),
      ).toEqual({
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
      });
    });
  });
});
