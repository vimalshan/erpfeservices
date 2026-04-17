import {
  BarChartModel,
  DoughnutChartModel,
  EMPTY_GRAPH_DATA,
  SharedSelectMultipleDatum,
} from '@customer-portal/shared';

import {
  FindingGraphsFilterCompaniesDataDto,
  FindingGraphsFilterServicesDataDto,
  FindingGraphsFilterSitesDataDto,
  FindingsByStatusGraphDto,
  FindingStatusByCategoryGraphDto,
  FindingsTrendsGraphDto,
  OpenFindingsGraphDto,
} from '../../dtos';
import { FindingGraphsMapperService } from './finding-graphs-mapper.service';

describe('FindingGraphsMapperService', () => {
  describe('mapToOpenFindingsGraphModel', () => {
    test('should return EMPTY_GRAPH_DATA when dto is null', () => {
      // Arrange
      const dto = null as unknown as OpenFindingsGraphDto;

      // Act
      const result =
        FindingGraphsMapperService.mapToOpenFindingsGraphModel(dto);

      // Assert
      expect(result).toBe(EMPTY_GRAPH_DATA);
    });

    test('should return EMPTY_GRAPH_DATA when dto.data.services is empty', () => {
      // Arrange
      const dto = { data: { services: [] } };

      // Act
      const result =
        FindingGraphsMapperService.mapToOpenFindingsGraphModel(dto);

      // Assert
      expect(result).toBe(EMPTY_GRAPH_DATA);
    });

    test('should map dto to OpenFindingsGraphModel correctly', () => {
      // Arrange
      const dto = {
        data: {
          services: [
            {
              service: 'Service A',
              categories: [
                { category: 'Observation', count: 10 },
                { category: 'CAT1 (Major)', count: 5 },
              ],
            },
            {
              service: 'Service B',
              categories: [
                { category: 'Observation', count: 7 },
                { category: 'CAT1 (Major)', count: 3 },
              ],
            },
          ],
        },
      };

      const expectedModel = {
        data: {
          labels: ['Service A', 'Service B'],
          datasets: [
            {
              label: 'Observation',
              data: [10, 7],
              backgroundColor: '#AEE9FF',
            },
            {
              label: 'CAT1 (Major)',
              data: [5, 3],
              backgroundColor: '#F7AAAE',
            },
          ],
        },
      };

      // Act
      const result =
        FindingGraphsMapperService.mapToOpenFindingsGraphModel(dto);

      // Assert
      expect(result).toEqual(expectedModel);
    });

    test('should handle missing categories gracefully', () => {
      // Arrange
      const dto = {
        data: {
          services: [
            {
              service: 'Service A',
              categories: [{ category: 'Observation', count: 10 }],
            },
            {
              service: 'Service B',
              categories: [],
            },
          ],
        },
      };

      const expectedModel = {
        data: {
          labels: ['Service A', 'Service B'],
          datasets: [
            {
              label: 'Observation',
              data: [10, 0],
              backgroundColor: '#AEE9FF',
            },
          ],
        },
      };

      // Act
      const result =
        FindingGraphsMapperService.mapToOpenFindingsGraphModel(dto);

      // Assert
      expect(result).toEqual(expectedModel);
    });
  });

  describe('mapToFindingsByStatusGraphModel', () => {
    test('should return EMPTY_GRAPH_DATA when dto is null', () => {
      // Arrange
      const dto = null as unknown as FindingsByStatusGraphDto;

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingsByStatusGraphModel(dto);

      // Assert
      expect(result).toBe(EMPTY_GRAPH_DATA);
    });

    test('should return empty graph data if stats array is not present in dto', () => {
      const dto = { data: {} };

      // Act
      const result = FindingGraphsMapperService.mapToFindingsByStatusGraphModel(
        dto as FindingsByStatusGraphDto,
      );

      // Assert
      expect(result).toEqual(EMPTY_GRAPH_DATA);
    });

    test('should return EMPTY_GRAPH_DATA when dto.data.stats is empty', () => {
      // Arrange
      const dto: FindingsByStatusGraphDto = {
        data: { stats: [], totalFindings: 0 },
      };

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingsByStatusGraphModel(dto);

      // Assert
      expect(result).toBe(EMPTY_GRAPH_DATA);
    });

    test('should return a valid graph model when dto data is provided', () => {
      // Arrange
      const dto: FindingsByStatusGraphDto = {
        data: {
          stats: [
            { status: 'Open', count: 10, percent: 50 },
            { status: 'Accepted', count: 5, percent: 25 },
            { status: 'Closed', count: 3, percent: 15 },
            { status: 'Not applicable', count: 2, percent: 10 },
          ],
          totalFindings: 20,
        },
      };

      const expectedModel: DoughnutChartModel = {
        data: {
          labels: ['Open', 'Accepted', 'Closed', 'Not applicable'],
          datasets: [
            {
              data: [10, 5, 3, 2],
              backgroundColor: ['#FAF492', '#33A02C', '#CCCBC9', '#E6E6E5'],
              hoverBackgroundColor: [
                '#FAF492',
                '#33A02C',
                '#CCCBC9',
                '#E6E6E5',
              ],
            },
          ],
          percentageValues: {
            Open: 50,
            Accepted: 25,
            Closed: 15,
            'Not applicable': 10,
          },
        },
      };

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingsByStatusGraphModel(dto);

      // Assert
      expect(result).toEqual(expectedModel);
    });

    test('should handle dto with missing or null percentage', () => {
      // Arrange
      const dto: FindingsByStatusGraphDto = {
        data: {
          stats: [
            { status: 'Open', count: 10, percent: undefined },
            { status: 'Accepted', count: 5, percent: undefined },
            { status: 'Closed', count: 3, percent: undefined },
            { status: 'Not applicable', count: 2, percent: undefined },
          ],
          totalFindings: 20,
        },
      };

      const expectedModel = {
        data: {
          labels: ['Open', 'Accepted', 'Closed', 'Not applicable'],
          datasets: [
            {
              data: [10, 5, 3, 2],
              backgroundColor: ['#FAF492', '#33A02C', '#CCCBC9', '#E6E6E5'],
              hoverBackgroundColor: [
                '#FAF492',
                '#33A02C',
                '#CCCBC9',
                '#E6E6E5',
              ],
            },
          ],
          percentageValues: {
            Open: undefined,
            Accepted: undefined,
            Closed: undefined,
            'Not applicable': undefined,
          },
        },
      };

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingsByStatusGraphModel(dto);

      // Assert
      expect(result).toEqual(expectedModel);
    });
  });

  describe('mapToFindingStatusByCategoryGraphModel', () => {
    test('should return EMPTY_GRAPH_DATA when dto is null', () => {
      // Arrange
      const dto = null as unknown as FindingStatusByCategoryGraphDto;

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingStatusByCategoryGraphModel(dto);

      // Assert
      expect(result).toBe(EMPTY_GRAPH_DATA);
    });

    test('should return empty graph data if stats array is not present in dto', () => {
      const dto = { data: {} };

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingStatusByCategoryGraphModel(
          dto as FindingStatusByCategoryGraphDto,
        );

      // Assert
      expect(result).toEqual(EMPTY_GRAPH_DATA);
    });

    test('should return EMPTY_GRAPH_DATA when dto.data.stats is empty', () => {
      // Arrange
      const dto: FindingStatusByCategoryGraphDto = {
        data: { stats: [] },
      };

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingStatusByCategoryGraphModel(dto);

      // Assert
      expect(result).toEqual(EMPTY_GRAPH_DATA);
    });

    test('should return a valid graph model when dto data is provided', () => {
      // Arrange
      const dto: FindingStatusByCategoryGraphDto = {
        data: {
          stats: [
            {
              category: 'Observation',
              statuses: [
                { status: 'Open', count: 10 },
                { status: 'Closed', count: 5 },
              ],
            },
            {
              category: 'CAT1 (Major)',
              statuses: [
                { status: 'Open', count: 3 },
                { status: 'Accepted', count: 2 },
              ],
            },
          ],
        },
      };

      const expectedModel: BarChartModel = {
        data: {
          labels: ['Observation', 'CAT1 (Major)'],
          datasets: [
            {
              label: 'Open',
              data: [10, 3],
              backgroundColor: '#FAF492',
            },
            {
              label: 'Closed',
              data: [5, 0],
              backgroundColor: '#CCCBC9',
            },
            {
              label: 'Accepted',
              data: [0, 2],
              backgroundColor: '#3F9C35',
            },
          ],
        },
      };

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingStatusByCategoryGraphModel(dto);

      // Assert
      expect(result).toEqual(expectedModel);
    });

    test('should handle missing or empty statuses gracefully', () => {
      // Arrange
      const dto: FindingStatusByCategoryGraphDto = {
        data: {
          stats: [
            {
              category: 'Observation',
              statuses: [], // No statuses for this category
            },
            {
              category: 'CAT1 (Major)',
              statuses: [
                { status: 'Open', count: 3 },
                { status: 'Closed', count: 2 },
              ],
            },
          ],
        },
      };

      const expectedModel: BarChartModel = {
        data: {
          labels: ['Observation', 'CAT1 (Major)'],
          datasets: [
            {
              label: 'Open',
              data: [0, 3],
              backgroundColor: '#FAF492',
            },
            {
              label: 'Closed',
              data: [0, 2],
              backgroundColor: '#CCCBC9',
            },
          ],
        },
      };

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingStatusByCategoryGraphModel(dto);

      // Assert
      expect(result).toEqual(expectedModel);
    });
  });

  describe('mapToFindingsTrendsGraphModel', () => {
    test('should map categories with correct colors and values', () => {
      // Arrange
      const dto: FindingsTrendsGraphDto = {
        data: {
          categories: [
            {
              categoryName: 'CAT1 (Major)',
              findings: [
                { year: 2022, count: 11 },
                { year: 2023, count: 17 },
                { year: 2024, count: 14 },
                { year: 2025, count: 1 },
              ],
            },
            {
              categoryName: 'CAT2 (Minor)',
              findings: [
                { year: 2022, count: 251 },
                { year: 2023, count: 275 },
                { year: 2024, count: 183 },
                { year: 2025, count: 0 },
              ],
            },
            {
              categoryName: 'Opportunity for Improvement',
              findings: [
                { year: 2022, count: 51 },
                { year: 2023, count: 75 },
                { year: 2024, count: 83 },
                { year: 2025, count: 3 },
              ],
            },
            {
              categoryName: 'Noteworthy Effort',
              findings: [
                { year: 2022, count: 1 },
                { year: 2023, count: 5 },
                { year: 2024, count: 3 },
                { year: 2025, count: 3 },
              ],
            },
          ],
        },
      };

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingsTrendsGraphModel(dto);

      // Assert
      expect(result).toEqual({
        data: {
          labels: ['2022', '2023', '2024', '2025'],
          datasets: [
            {
              label: 'CAT1 (Major)',
              data: [11, 17, 14, 1],
              backgroundColor: '#D3262F',
              borderColor: '#D3262F',
            },
            {
              label: 'CAT2 (Minor)',
              data: [251, 275, 183, 0],
              backgroundColor: '#FFF699',
              borderColor: '#FFF699',
            },
            {
              label: 'Opportunity for Improvement',
              data: [51, 75, 83, 3],
              backgroundColor: '#FBB482',
              borderColor: '#FBB482',
            },
            {
              label: 'Noteworthy Effort',
              data: [1, 5, 3, 3],
              backgroundColor: '#3F9C35',
              borderColor: '#3F9C35',
            },
          ],
        },
      });
    });

    test('should return empty data if dto is null or empty', () => {
      // Act
      const result = FindingGraphsMapperService.mapToFindingsTrendsGraphModel({
        data: [] as any,
      });

      // Assert
      expect(result).toEqual({
        data: {
          labels: [],
          datasets: [],
        },
      });
    });
  });

  describe('mapToChartFilterSites', () => {
    test('should return an empty array when input data is undefined', () => {
      // Arrange
      const data = undefined;

      // Act
      const result = FindingGraphsMapperService.mapToChartFilterSites(data);

      // Assert
      expect(result).toEqual([]);
    });

    test('should return an empty array when input data is an empty array', () => {
      // Arrange
      const data: FindingGraphsFilterSitesDataDto[] = [];

      // Act
      const result = FindingGraphsMapperService.mapToChartFilterSites(data);

      // Assert
      expect(result).toEqual([]);
    });

    test('should map the data correctly for a single level of sites', () => {
      const data: FindingGraphsFilterSitesDataDto[] = [
        { id: 1, label: 'Site 1', children: [] },
        { id: 2, label: 'Site 2', children: [] },
      ];

      const expectedResult = [
        { data: 1, depth: 0, key: '1-Site 1', label: 'Site 1', children: [] },
        { data: 2, depth: 0, key: '2-Site 2', label: 'Site 2', children: [] },
      ];

      // Act
      const result = FindingGraphsMapperService.mapToChartFilterSites(data);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    test('should handle mixed site structures (some with children, some without)', () => {
      // Arrange
      const data: FindingGraphsFilterSitesDataDto[] = [
        { id: 1, label: 'Site 1', children: [] },
        {
          id: 2,
          label: 'Site 2',
          children: [
            { id: 3, label: 'Subsite 1', children: [] },
            { id: 4, label: 'Subsite 2', children: [] },
          ],
        },
      ];

      const expectedResult = [
        { data: 1, depth: 0, key: '1-Site 1', label: 'Site 1', children: [] },
        {
          data: 2,
          depth: 0,
          key: '2-Site 2',
          label: 'Site 2',
          children: [
            {
              data: 3,
              depth: 1,
              key: '3-Subsite 1',
              label: 'Subsite 1',
              children: [],
            },
            {
              data: 4,
              depth: 1,
              key: '4-Subsite 2',
              label: 'Subsite 2',
              children: [],
            },
          ],
        },
      ];

      // Act
      const result = FindingGraphsMapperService.mapToChartFilterSites(data);

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe('mapToFindingGraphsFilterCompanies', () => {
    test('should return an empty array when input data is an empty array', () => {
      // Arrange
      const data: FindingGraphsFilterCompaniesDataDto[] = [];

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingGraphsFilterCompanies(data);

      // Assert
      expect(result).toEqual([]);
    });

    test('should map the data correctly for a single company', () => {
      // Arrange
      const data: FindingGraphsFilterCompaniesDataDto[] = [
        { id: 1, label: 'Company A' },
      ];

      const expectedResult: SharedSelectMultipleDatum<number>[] = [
        { label: 'Company A', value: 1 },
      ];

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingGraphsFilterCompanies(data);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    test('should map the data correctly for multiple companies', () => {
      // Arrange
      const data: FindingGraphsFilterCompaniesDataDto[] = [
        { id: 1, label: 'Company A' },
        { id: 2, label: 'Company B' },
      ];

      const expectedResult: SharedSelectMultipleDatum<number>[] = [
        { label: 'Company A', value: 1 },
        { label: 'Company B', value: 2 },
      ];

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingGraphsFilterCompanies(data);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    test('should map the data correctly when company label is empty', () => {
      // Arrange
      const data: FindingGraphsFilterCompaniesDataDto[] = [
        { id: 1, label: '' },
      ];

      const expectedResult: SharedSelectMultipleDatum<number>[] = [
        { label: '', value: 1 },
      ];

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingGraphsFilterCompanies(data);

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe('mapToFindingGraphsFilterServices', () => {
    test('should return an empty array when input data is an empty array', () => {
      // Arrange
      const data: FindingGraphsFilterServicesDataDto[] = [];

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingGraphsFilterServices(data);

      // Assert
      expect(result).toEqual([]);
    });

    test('should map the data correctly for a single company', () => {
      // Arrange
      const data: FindingGraphsFilterServicesDataDto[] = [
        { id: 1, label: 'Company A' },
      ];

      const expectedResult: SharedSelectMultipleDatum<number>[] = [
        { label: 'Company A', value: 1 },
      ];

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingGraphsFilterServices(data);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    test('should map the data correctly for multiple companies', () => {
      // Arrange
      const data: FindingGraphsFilterServicesDataDto[] = [
        { id: 1, label: 'Company A' },
        { id: 2, label: 'Company B' },
      ];

      const expectedResult: SharedSelectMultipleDatum<number>[] = [
        { label: 'Company A', value: 1 },
        { label: 'Company B', value: 2 },
      ];

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingGraphsFilterServices(data);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    test('should map the data correctly when company label is empty', () => {
      // Arrange
      const data: FindingGraphsFilterServicesDataDto[] = [{ id: 1, label: '' }];

      const expectedResult: SharedSelectMultipleDatum<number>[] = [
        { label: '', value: 1 },
      ];

      // Act
      const result =
        FindingGraphsMapperService.mapToFindingGraphsFilterServices(data);

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });
});
