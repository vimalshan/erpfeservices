import {
  FilteringConfig,
  FilterMode,
  FilterOperator,
} from '@customer-portal/shared';

import { AuditListDto, SitesListDto } from '../../dtos';
import { AuditDetailsMapperService } from './audit-details-mapper.service';
import { AuditListMapperService } from './audit-list-mapper.service';

describe('AuditListMapperService', () => {
  describe('mapToAuditItemModel', () => {
    test('should return an empty array if dto.data is undefined', () => {
      // Arrange
      const dto: AuditListDto = {
        data: undefined as unknown as [],
        isSuccess: true,
        message: '',
        errorCode: '',
        __typename: 'AuditListDto',
      };

      // Act
      const result = AuditListMapperService.mapToAuditItemModel(dto);

      // Assert
      expect(result).toEqual([]);
    });

    test('should map dto data to model correctly', () => {
      // Arrange
      const dto: AuditListDto = {
        data: [
          {
            auditId: 1,
            startDate: '2021-01-01',
            endDate: '2021-02-01',
            companyName: 'mock company',
            countries: ['France'],
            cities: ['City 1', 'City 2'],
            services: ['Service 1', 'Service 2'],
            sites: ['Site 1', 'Site 2'],
            leadAuditor: 'Lead Auditor 1',
            status: 'Completed',
            type: 'Type 1',
          },
        ],
        isSuccess: true,
        message: '',
        errorCode: '',
        __typename: 'AuditListDto',
      };

      // Act
      const result = AuditListMapperService.mapToAuditItemModel(dto);

      // Assert
      expect(result).toEqual([
        {
          auditNumber: '1',
          startDate: '01-01-2021',
          endDate: '01-02-2021',
          companyName: 'mock company',
          country: 'France',
          city: 'City 1 || City 2',
          service: 'Service 1 || Service 2',
          site: 'Site 1 || Site 2',
          leadAuthor: 'Lead Auditor 1',
          status: 'Completed',
          type: 'Type 1',
        },
      ]);
    });

    test('should eliminate duplicate services', () => {
      // Arrange
      const dto: AuditListDto = {
        data: [
          {
            auditId: 2,
            companyName: 'mock company',
            startDate: '2021-03-01',
            endDate: '2021-04-01',
            countries: ['France'],
            cities: ['City 3', 'City 4'],
            services: ['Service 1', 'Service 1'],
            sites: ['Site 3', 'Site 4'],
            leadAuditor: 'Lead Auditor 2',
            status: 'In Progress',
            type: 'Type 2',
          },
        ],
        isSuccess: true,
        message: '',
        errorCode: '',
        __typename: 'AuditListDto',
      };

      // Act
      const result = AuditListMapperService.mapToAuditItemModel(dto);

      // Assert
      expect(result).toEqual([
        {
          auditNumber: '2',
          companyName: 'mock company',
          startDate: '01-03-2021',
          endDate: '01-04-2021',
          country: 'France',
          city: 'City 3 || City 4',
          service: 'Service 1',
          site: 'Site 3 || Site 4',
          leadAuthor: 'Lead Auditor 2',
          status: 'In Progress',
          type: 'Type 2',
        },
      ]);
    });

    test('should eliminate duplicate sites', () => {
      // Arrange
      const dto: AuditListDto = {
        data: [
          {
            auditId: 3,
            companyName: 'mock company',
            startDate: '2021-05-01',
            endDate: '2021-06-01',
            countries: ['France'],
            cities: ['City 5', 'City 6'],
            services: ['Service 3', 'Service 4'],
            sites: ['Site 1', 'Site 1'],
            leadAuditor: 'Lead Auditor 3',
            status: 'Pending',
            type: 'Type 3',
          },
        ],
        isSuccess: true,
        message: '',
        errorCode: '',
        __typename: 'AuditListDto',
      };

      // Act
      const result = AuditListMapperService.mapToAuditItemModel(dto);

      // Assert
      expect(result).toEqual([
        {
          auditNumber: '3',
          companyName: 'mock company',
          startDate: '01-05-2021',
          endDate: '01-06-2021',
          country: 'France',
          city: 'City 5 || City 6',
          service: 'Service 3 || Service 4',
          site: 'Site 1',
          leadAuthor: 'Lead Auditor 3',
          status: 'Pending',
          type: 'Type 3',
        },
      ]);
    });

    test('should eliminate duplicate cities', () => {
      // Arrange
      const dto: AuditListDto = {
        data: [
          {
            auditId: 4,
            companyName: 'mock company',
            startDate: '2021-07-01',
            endDate: '2021-08-01',
            countries: ['France'],
            cities: ['City 1', 'City 1'],
            services: ['Service 5', 'Service 6'],
            sites: ['Site 7', 'Site 8'],
            leadAuditor: 'Lead Auditor 4',
            status: 'Cancelled',
            type: 'Type 4',
          },
        ],
        isSuccess: true,
        message: '',
        errorCode: '',
        __typename: 'AuditListDto',
      };

      // Act
      const result = AuditListMapperService.mapToAuditItemModel(dto);

      // Assert
      expect(result).toEqual([
        {
          auditNumber: '4',
          companyName: 'mock company',
          startDate: '01-07-2021',
          endDate: '01-08-2021',
          country: 'France',
          city: 'City 1',
          service: 'Service 5 || Service 6',
          site: 'Site 7 || Site 8',
          leadAuthor: 'Lead Auditor 4',
          status: 'Cancelled',
          type: 'Type 4',
        },
      ]);
    });
  });

  describe('mapToAuditExcelPayloadDto', () => {
    test('should map filterConfig to AuditExcelPayloadDto correctly', () => {
      // Arrange
      const filterConfig: FilteringConfig = {
        auditNumber: {
          value: [{ value: '123', label: '123' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        country: {
          value: [{ value: 'France', label: 'France' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        city: {
          value: [{ value: 'City 1', label: 'City 1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        service: {
          value: [{ value: 'Service 1', label: 'Service 1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        leadAuthor: {
          value: [{ value: 'Lead Auditor 1', label: 'Lead Auditor 1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        site: {
          value: [{ value: 'Site 1', label: 'Site 1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        type: {
          value: [
            {
              value: 'Preliminary Assessment',
              label: 'Preliminary Assessment',
            },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        status: {
          value: [{ value: 'Completed', label: 'Completed' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        startDate: {
          value: [
            {
              value: '01-05-2024',
              label: '01-05-2024',
            },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        endDate: {
          value: [
            {
              value: '01-05-2024',
              label: '01-05-2024',
            },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result =
        AuditListMapperService.mapToAuditExcelPayloadDto(filterConfig);
      // Assert
      expect(result).toEqual({
        filters: {
          auditId: [123],
          companyName: null,
          country: ['France'],
          city: ['City 1'],
          service: ['Service 1'],
          leadAuditor: ['Lead Auditor 1'],
          site: ['Site 1'],
          type: ['Preliminary Assessment'],
          status: ['Completed'],
          startDate: ['2024-05-01'],
          endDate: ['2024-05-01'],
        },
      });
    });
  });

  describe('mapToAuditSitesItemModel', () => {
    test('should return an empty array if dto.data is undefined', () => {
      // Arrange
      const dto: SitesListDto = { data: undefined as unknown as [] };

      // Act
      const result = AuditDetailsMapperService.mapToAuditSitesItemModel(dto);

      // Assert
      expect(result).toEqual([]);
    });

    test('should map dto data to model correctly', () => {
      // Arrange
      const dto: SitesListDto = {
        data: [
          {
            siteName: 'TTT',
            addressLine: 'TTTsiteAddress',
            city: 'Cey',
            country: 'Mont',
            postCode: '9090',
          },
        ],
      };

      // Act
      const result = AuditDetailsMapperService.mapToAuditSitesItemModel(dto);

      // Assert
      expect(result).toEqual([
        {
          siteName: 'TTT',
          siteAddress: 'TTTsiteAddress',
          city: 'Cey',
          country: 'Mont',
          postcode: '9090',
        },
      ]);
    });
  });
});
