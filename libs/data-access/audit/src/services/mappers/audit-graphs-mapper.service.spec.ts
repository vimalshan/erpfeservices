import { EMPTY_GRAPH_DATA } from '@customer-portal/shared';

import { AuditGraphsFilterSitesDataDto } from '../../dtos';
import { AuditGraphsMapperService } from './audit-graphs-mapper.service';

describe('AuditGraphsMapperService', () => {
  describe('mapToAuditStatusDoughnutGraphModel', () => {
    test('should return EMPTY_GRAPH_DATA if mapToAuditStatusDoughnutGraphModel is called with wrong dto', () => {
      // Arrange
      const mockDto = { data: null as any };

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditStatusDoughnutGraphModel(mockDto);

      // Assert
      expect(result).toEqual(EMPTY_GRAPH_DATA);
    });

    test('should map dto to AuditStatusDoughnutGraphModel correctly', () => {
      // Arrange
      const mockDto = {
        data: {
          stats: [
            { status: 'Confirmed', count: 10, percent: 50 },
            { status: 'In Progress', count: 5, percent: 25 },
            { status: 'To be confirmed', count: 5, percent: 25 },
          ],
          totalAudits: 0,
        },
      };

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditStatusDoughnutGraphModel(mockDto);

      // Assert
      expect(result).toEqual({
        data: {
          labels: ['Confirmed', 'In Progress', 'To be confirmed'],
          datasets: [
            {
              data: [10, 5, 5],
              backgroundColor: ['#AEE9FF', '#FAF492', '#FBB482'],
              hoverBackgroundColor: ['#AEE9FF', '#FAF492', '#FBB482'],
            },
          ],
          percentageValues: {
            Confirmed: 50,
            'In Progress': 25,
            'To be confirmed': 25,
          },
        },
      });
    });
  });

  describe('mapToAuditStatusBarTypeGraphModel', () => {
    test('should return EMPTY_GRAPH_DATA if mapToAuditStatusBarTypeGraphModel is called with wrong dto', () => {
      // Arrange
      const mockDto = { data: null as any };

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditStatusBarTypeGraphModel(mockDto);

      // Assert
      expect(result).toEqual(EMPTY_GRAPH_DATA);
    });

    test('should map dto to AuditsStatusBarGraphModel correctly', () => {
      // Arrange
      const mockDto = {
        data: {
          stats: [
            {
              type: 'Initial',
              statuses: [
                { status: 'Confirmed', count: 5 },
                { status: 'In Progress', count: 3 },
              ],
            },
            {
              type: 'Periodic 1',
              statuses: [
                { status: 'Confirmed', count: 2 },
                { status: 'To be confirmed', count: 4 },
              ],
            },
          ],
        },
      };

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditStatusBarTypeGraphModel(mockDto);

      // Assert
      expect(result).toEqual({
        data: {
          labels: ['Initial', 'Periodic 1'],
          datasets: [
            {
              label: 'Confirmed',
              data: [5, 2],
              backgroundColor: '#AEE9FF',
            },
            {
              label: 'In Progress',
              data: [3, 0],
              backgroundColor: '#FAF492',
            },
            {
              label: 'To be confirmed',
              data: [0, 4],
              backgroundColor: '#FBB482',
            },
          ],
        },
      });
    });
  });

  describe('mapToAuditDaysDoughnutGraphModel', () => {
    test('should be empty graph data for empty input', () => {
      // Arrange
      const mockDto: any = {
        data: {
          pieChartData: [],
        },
      };

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditDaysDoughnutGraphModel(mockDto);

      // Assert
      expect(result).toEqual(EMPTY_GRAPH_DATA);
    });
  });

  describe('mapToAuditDaysBarTypeGraphModel', () => {
    test('should be empty graph data for empty input', () => {
      // Arrange
      const mockDto: any = {
        data: {
          chartData: [],
        },
      };

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditDaysBarTypeGraphModel(mockDto);

      // Assert
      expect(result).toEqual(EMPTY_GRAPH_DATA);
    });
  });

  describe('mapToChartFilterSites', () => {
    test('should return empty array when data is undefined', () => {
      // Act
      const result = AuditGraphsMapperService.mapToChartFilterSites(undefined);

      // Assert
      expect(result).toEqual([]);
    });

    test('should map flat data correctly', () => {
      // Arrange
      const input: AuditGraphsFilterSitesDataDto[] = [
        { id: 1, label: 'Site A' },
        { id: 2, label: 'Site B' },
      ];

      const expected = [
        {
          data: 1,
          depth: 0,
          key: '1-Site A',
          label: 'Site A',
          children: [],
        },
        {
          data: 2,
          depth: 0,
          key: '2-Site B',
          label: 'Site B',
          children: [],
        },
      ];

      // Act
      const result = AuditGraphsMapperService.mapToChartFilterSites(input);

      // Assert
      expect(result).toEqual(expected);
    });

    test('should map nested data correctly', () => {
      // Arrange
      const input: AuditGraphsFilterSitesDataDto[] = [
        {
          id: 1,
          label: 'Parent Site',
          children: [
            { id: 2, label: 'Child Site' },
            {
              id: 3,
              label: 'Another Child',
              children: [{ id: 4, label: 'Grandchild' }],
            },
          ],
        },
      ];

      // Act
      const result = AuditGraphsMapperService.mapToChartFilterSites(input);

      // Assert
      expect(result).toEqual([
        {
          data: 1,
          depth: 0,
          key: '1-Parent Site',
          label: 'Parent Site',
          children: [
            {
              data: 2,
              depth: 1,
              key: '2-Child Site',
              label: 'Child Site',
              children: [],
            },
            {
              data: 3,
              depth: 1,
              key: '3-Another Child',
              label: 'Another Child',
              children: [
                {
                  data: 4,
                  depth: 2,
                  key: '4-Grandchild',
                  label: 'Grandchild',
                  children: [],
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe('mapToAuditGraphsFilterCompanies', () => {
    test('should return an empty array if input is an empty array', () => {
      // Arrange
      const mockDto: any[] = [];

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditGraphsFilterCompanies(mockDto);

      // Assert
      expect(result).toEqual([]);
    });

    test('should handle a single value array correctly', () => {
      // Arrange
      const mockDto = [{ id: 3, label: 'Company C' }];

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditGraphsFilterCompanies(mockDto);

      // Assert
      expect(result).toEqual([{ label: 'Company C', value: 3 }]);
    });

    test('should map dto to filterCompanies correctly', () => {
      // Arrange
      const mockDto = [
        {
          id: 1,
          label: 'ABC Technologies',
        },
        {
          id: 2,
          label: 'XYZ Solutions',
        },
        {
          id: 3,
          label: 'Global Innovations',
        },
        {
          id: 4,
          label: 'TechWave',
        },
        {
          id: 5,
          label: 'NextGen Systems',
        },
      ];

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditGraphsFilterCompanies(mockDto);

      // Assert
      expect(result).toEqual([
        { label: 'ABC Technologies', value: 1 },
        { label: 'XYZ Solutions', value: 2 },
        { label: 'Global Innovations', value: 3 },
        { label: 'TechWave', value: 4 },
        { label: 'NextGen Systems', value: 5 },
      ]);
    });
  });

  describe('mapToAuditGraphsFilterServices', () => {
    test('should return an empty array if input is an empty array', () => {
      // Arrange
      const mockDto: any[] = [];

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditGraphsFilterServices(mockDto);

      // Asssert
      expect(result).toEqual([]);
    });

    test('should handle a single value array correctly', () => {
      // Arrange
      const mockDto = [{ id: 1, label: 'Service A' }];

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditGraphsFilterServices(mockDto);

      // Assert
      expect(result).toEqual([{ label: 'Service A', value: 1 }]);
    });

    test('should map dto to filterServices correctly', () => {
      // Arrange
      const mockDto = [
        { id: 1, label: 'Service A' },
        { id: 2, label: 'Service B' },
      ];

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditGraphsFilterServices(mockDto);

      // Assert
      expect(result).toEqual([
        { label: 'Service A', value: 1 },
        { label: 'Service B', value: 2 },
      ]);
    });
  });

  describe('mapToAuditGraphsFilterSites', () => {
    test('should return an empty array if input is an empty array', () => {
      // Arrange
      const mockDto: any[] = [];

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditGraphsFilterSites(mockDto);

      // Assert
      expect(result).toEqual([]);
    });

    test('should handle a single value array correctly', () => {
      // Arrange
      const mockDto = [{ id: 1, label: 'Site A', children: [] }];

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditGraphsFilterSites(mockDto);

      // Assert
      expect(result).toEqual([
        {
          data: 1,
          key: expect.any(String),
          label: 'Site A',
          children: [],
        },
      ]);
    });

    test('should map dto to filterSites correctly', () => {
      // Arrange
      const mockDto = [
        {
          id: 1,
          label: 'Site A',
          children: [],
        },
        {
          id: 2,
          label: 'Site B',
          children: [
            {
              id: 3,
              label: 'Subsite B1',
              children: [],
            },
          ],
        },
      ];

      // Act
      const result =
        AuditGraphsMapperService.mapToAuditGraphsFilterSites(mockDto);

      // Assert
      expect(result).toEqual([
        {
          data: 1,
          key: expect.any(String),
          label: 'Site A',
          children: [],
        },
        {
          data: 2,
          key: expect.any(String),
          label: 'Site B',
          children: [
            {
              data: 3,
              key: expect.any(String),
              label: 'Subsite B1',
              children: [],
            },
          ],
        },
      ]);
    });
  });
});
