import { AuditDaysGridDto } from '../../dtos';
import { AuditDaysGridMapperService } from './audit-days-grid-mapper.service';

describe('AuditDaysGridMapperService', () => {
  describe('mapToAuditDaysGridModel', () => {
    test('should return an empty array when dto has no data', () => {
      // Arrange
      const emptyDto: AuditDaysGridDto = {
        isSuccess: true,
        message: '',
        errorCode: '',
        data: [],
      };

      // Act
      const result =
        AuditDaysGridMapperService.mapToAuditDaysGridModel(emptyDto);

      // Assert
      expect(result).toEqual([]);
    });

    test('should correctly map a single-level DTO to the model', () => {
      // Arrange
      const singleLevelDto: AuditDaysGridDto = {
        isSuccess: true,
        message: '',
        errorCode: '',
        data: [
          {
            data: { id: 1, name: 'USA', auditDays: 10, dataType: 'country' },
          },
        ],
      };

      // Act
      const result =
        AuditDaysGridMapperService.mapToAuditDaysGridModel(singleLevelDto);

      // Assert
      expect(result).toEqual([
        {
          data: { location: 'USA', auditDays: 10, dataType: 'country' },
          children: [],
        },
      ]);
    });

    test('should correctly map a multi-level DTO to the model', () => {
      // Arrange
      const mockDto: AuditDaysGridDto = {
        isSuccess: true,
        message: '',
        errorCode: '',
        data: [
          {
            data: {
              id: 285,
              name: 'Brazil',
              auditDays: 5,
              dataType: 'country',
            },
            children: [
              {
                data: {
                  name: 'Contagem',
                  auditDays: 2,
                  dataType: 'city',
                },
                children: [
                  {
                    data: {
                      id: 173549,
                      name: 'MARELLI SISTEMAS AUTOMOTIVOS INDUSTRIA E COMERCIO BRASIL LTDA',
                      auditDays: 2,
                      dataType: 'site',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      // Act
      const result =
        AuditDaysGridMapperService.mapToAuditDaysGridModel(mockDto);

      // Assert
      expect(result).toEqual([
        {
          data: {
            location: 'Brazil',
            auditDays: 5,
            dataType: 'country',
          },
          children: [
            {
              data: {
                location: 'Contagem',
                auditDays: 2,
                dataType: 'city',
              },
              children: [
                {
                  data: {
                    location:
                      'MARELLI SISTEMAS AUTOMOTIVOS INDUSTRIA E COMERCIO BRASIL LTDA',
                    auditDays: 2,
                    dataType: 'site',
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ]);
    });

    test('should handle nodes without children properly', () => {
      // Arrange
      const dtoWithoutChildren: AuditDaysGridDto = {
        isSuccess: true,
        message: '',
        errorCode: '',
        data: [
          {
            data: {
              id: 2,
              name: 'Germany',
              auditDays: 15,
              dataType: 'country',
            },
            children: [],
          },
        ],
      };

      // Act
      const result =
        AuditDaysGridMapperService.mapToAuditDaysGridModel(dtoWithoutChildren);

      // Assert
      expect(result).toEqual([
        {
          data: { location: 'Germany', auditDays: 15, dataType: 'country' },
          children: [],
        },
      ]);
    });

    test('should handle complex nested structure correctly', () => {
      // Arrange
      const mockDto: AuditDaysGridDto = {
        isSuccess: true,
        message: '',
        errorCode: '',
        data: [
          {
            data: {
              id: 285,
              name: 'Brazil',
              auditDays: 5,
              dataType: 'country',
            },
            children: [
              {
                data: {
                  name: 'Contagem',
                  auditDays: 2,
                  dataType: 'city',
                },
                children: [
                  {
                    data: {
                      id: 173549,
                      name: 'MARELLI SISTEMAS AUTOMOTIVOS INDUSTRIA E COMERCIO BRASIL LTDA',
                      auditDays: 2,
                      dataType: 'site',
                    },
                  },
                ],
              },
              {
                data: {
                  name: 'Maua',
                  auditDays: 3,
                  dataType: 'city',
                },
                children: [
                  {
                    data: {
                      id: 171095,
                      name: 'MARELLI SISTEMAS AUTOMOTIVOS INDUSTRIA E COMERCIO LTDA',
                      auditDays: 3,
                      dataType: 'site',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      // Act
      const result =
        AuditDaysGridMapperService.mapToAuditDaysGridModel(mockDto);

      // Assert
      expect(result).toEqual([
        {
          data: {
            location: 'Brazil',
            auditDays: 5,
            dataType: 'country',
          },
          children: [
            {
              data: {
                location: 'Contagem',
                auditDays: 2,
                dataType: 'city',
              },
              children: [
                {
                  data: {
                    location:
                      'MARELLI SISTEMAS AUTOMOTIVOS INDUSTRIA E COMERCIO BRASIL LTDA',
                    auditDays: 2,
                    dataType: 'site',
                  },
                  children: [],
                },
              ],
            },
            {
              data: {
                location: 'Maua',
                auditDays: 3,
                dataType: 'city',
              },
              children: [
                {
                  data: {
                    location:
                      'MARELLI SISTEMAS AUTOMOTIVOS INDUSTRIA E COMERCIO LTDA',
                    auditDays: 3,
                    dataType: 'site',
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ]);
    });
  });
});
