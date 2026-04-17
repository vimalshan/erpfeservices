import {
  FilteringConfig,
  FilterMode,
  FilterOperator,
} from '@customer-portal/shared';

import {
  AuditDetailsDescriptionDto,
  AuditDetailsDto,
  AuditDocumentListItemDto,
  AuditDocumentsListDto,
  AuditFindingListDto,
  SitesListDto,
  SubAuditListDto,
} from '../../dtos';
import { AuditDetailsMapperService } from './audit-details-mapper.service';

describe('AuditDetailsMapperService', () => {
  let originalLocale: string;
  beforeAll(() => {
    // Save the original locale
    originalLocale = Intl.DateTimeFormat().resolvedOptions().locale;

    // Mock the locale to 'en-US'
    Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
      value: () => ({ locale: 'en-US' }),
    });
  });

  afterAll(() => {
    // Restore the original locale
    Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
      value: () => ({ locale: originalLocale }),
    });
  });

  describe('mapToAuditFindingListItemModel', () => {
    test('should return an empty array if dto.data is undefined', () => {
      // Arrange
      const dto: AuditFindingListDto = { data: undefined as unknown as [] };

      // Act
      const result =
        AuditDetailsMapperService.mapToAuditFindingListItemModel(dto);

      // Assert
      expect(result).toEqual([]);
    });

    test('should map finding list dto data to model correctly', () => {
      // Arrange
      const dto: AuditFindingListDto = {
        data: [
          {
            findingsId: '123',
            findingNumber: 'MANMES-0031',
            status: 'Open',
            title: 'Major security vulnerability found',
            category: 'Security',
            companyName: 'company1',
            services: ['OWASP Top 10', 'NIST 800-53'],
            sites: ['Site 1', 'Site 2'],
            cities: ['San Francisco', 'Bucharest'],
            auditId: '2024001',
            openDate: '2017-01-20T00:00:00.000+00:00',
            dueDate: '2017-01-20T00:00:00.000+00:00',
            closedDate: '2017-01-20T00:00:00.000+00:00',
            acceptedDate: '2017-01-20T00:00:00.000+00:00',
          },
          {
            findingsId: '456',
            findingNumber: 'MANMES-0032',
            status: 'Closed',
            title: 'Process improvement needed',
            category: 'Quality',
            companyName: 'company2',
            services: ['ISO 9001:2015', 'Six Sigma'],
            sites: ['Site 3', 'Site 4'],
            cities: ['Detroit', 'Toronto'],
            auditId: '2024002',
            openDate: '2017-01-20T00:00:00.000+00:00',
            dueDate: '2017-01-20T00:00:00.000+00:00',
            closedDate: '2017-01-20T00:00:00.000+00:00',
            acceptedDate: '2017-01-20T00:00:00.000+00:00',
          },
        ],
      };

      // Act
      const result =
        AuditDetailsMapperService.mapToAuditFindingListItemModel(dto);

      // Assert
      expect(result).toEqual([
        {
          findingNumber: 'MANMES-0031',
          status: 'Open',
          title: 'Major security vulnerability found',
          category: 'Security',
          companyName: 'company1',
          services: 'OWASP Top 10 || NIST 800-53',
          site: 'Site 1 || Site 2',
          city: 'San Francisco || Bucharest',
          auditNumber: '2024001',
          openDate: '20.01.2017',
          dueDate: '20.01.2017',
          closeDate: '20.01.2017',
          acceptedDate: '20.01.2017',
        },
        {
          findingNumber: 'MANMES-0032',
          status: 'Closed',
          title: 'Process improvement needed',
          category: 'Quality',
          companyName: 'company2',
          services: 'ISO 9001:2015 || Six Sigma',
          site: 'Site 3 || Site 4',
          city: 'Detroit || Toronto',
          auditNumber: '2024002',
          openDate: '20.01.2017',
          dueDate: '20.01.2017',
          closeDate: '20.01.2017',
          acceptedDate: '20.01.2017',
        },
      ]);
    });
  });

  describe('mapToAuditFindingsExcelPayloadDto', () => {
    test('should map filterConfig to AuditFindingsExcelPayloadDto correctly', () => {
      // Arrange
      const filterConfig: FilteringConfig = {
        findingNumber: {
          value: [{ value: '123', label: '123' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        auditNumber: {
          value: [{ value: '456', label: '456' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        status: {
          value: [{ value: 'Open', label: 'Open' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        title: {
          value: [{ value: 'Some Title', label: 'Some Title' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        category: {
          value: [{ value: 'Category 1', label: 'Category 1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        companyName: {
          value: [{ value: 'Company 1', label: 'Company 1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        service: {
          value: [{ value: 'Service 1', label: 'Service 1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        city: {
          value: [{ value: 'City 1', label: 'City 1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        site: {
          value: [{ value: 'Site 1', label: 'Site 1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        openDate: {
          value: [
            {
              value: '01-05-2024',
              label: '01-05-2024',
            },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        dueDate: {
          value: [
            {
              value: '01-05-2024',
              label: '01-05-2024',
            },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        acceptedDate: {
          value: [
            {
              value: '01-05-2024',
              label: '01-05-2024',
            },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        closeDate: {
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
      const auditId = '101';

      // Act
      const result =
        AuditDetailsMapperService.mapToAuditFindingsExcelPayloadDto(
          filterConfig,
          auditId,
        );

      // Assert
      expect(result).toEqual({
        filters: {
          findings: ['123'],
          audit: ['456'],
          auditId: [101],
          status: ['Open'],
          title: ['Some Title'],
          category: ['Category 1'],
          companyName: ['Company 1'],
          service: ['Service 1'],
          city: ['City 1'],
          site: ['Site 1'],
          openDate: ['2024-05-01'],
          dueDate: ['2024-05-01'],
          acceptedDate: ['2024-05-01'],
          closeDate: ['2024-05-01'],
        },
      });
    });
  });

  describe('mapToSubAuditItemModel', () => {
    test('should return an empty array if dto.data is undefined', () => {
      // Arrange
      const dto: SubAuditListDto = { data: undefined as unknown as [] };

      // Act
      const result = AuditDetailsMapperService.mapToSubAuditItemModel(dto);

      // Assert
      expect(result).toEqual([]);
    });

    test('should map sub audit list dto data to model correctly', () => {
      // Arrange
      const dto: SubAuditListDto = {
        data: [
          {
            auditId: 1,
            status: 'Completed',
            services: ['Service 1'],
            sites: ['Site 1'],
            cities: ['City 1'],
            startDate: '2017-01-20T00:00:00.000+00:00',
            endDate: '2017-01-20T00:00:00.000+00:00',
            auditorTeam: ['Auditor 1', 'Auditor 2'],
          },
        ],
      };

      // Act
      const result = AuditDetailsMapperService.mapToSubAuditItemModel(dto);

      // Assert
      expect(result).toEqual([
        {
          auditNumber: '1',
          status: 'Completed',
          service: 'Service 1',
          site: 'Site 1',
          city: 'City 1',
          startDate: '20-01-2017',
          endDate: '20-01-2017',
          auditorTeam: 'Auditor 1 || Auditor 2',
        },
      ]);
    });
  });

  describe('mapToSubAuditExcelPayloadDto', () => {
    test('should map filterConfig to SubAuditExcelPayloadDto correctly', () => {
      // Arrange
      const auditId = 1;
      const filterConfig: FilteringConfig = {
        city: {
          value: [{ value: 'city', label: 'city' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        site: {
          value: [{ value: 'site', label: 'site' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        service: {
          value: [{ value: 'Service', label: 'Service' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        status: {
          value: [{ value: 'In Progress', label: 'In Progress' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        startDate: {
          value: [{ value: '01-01-2024', label: '01-01-2024' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        endDate: {
          value: [{ value: '05-01-2024', label: '01-01-2024' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        auditorTeam: {
          value: [{ value: 'Auditor Team', label: 'Auditor Team' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result = AuditDetailsMapperService.mapToSubAuditExcelPayloadDto(
        auditId,
        filterConfig,
      );

      // Assert
      expect(result).toEqual({
        auditId: 1,
        filters: {
          status: ['In Progress'],
          service: ['Service'],
          sites: ['site'],
          city: ['city'],
          startDate: ['2024-01-01'],
          endDate: ['2024-01-05'],
          auditorTeam: ['Auditor Team'],
        },
      });
    });
  });

  describe('mapToAuditDetailsModel', () => {
    test('should return null if dto.data is undefined', () => {
      // Arrange
      const dto: AuditDetailsDto = {
        data: undefined as unknown as AuditDetailsDescriptionDto,
        isSuccess: true,
      };
      const reportsDto: AuditDocumentsListDto = {
        data: undefined as unknown as AuditDocumentListItemDto[],
        isSuccess: true,
        message: 'test',
      };

      // Act
      const result = AuditDetailsMapperService.mapToAuditDetailsModel(
        dto,
        reportsDto,
      );

      // Assert
      expect(result).toBeNull();
    });

    test('should map audit details dto data to model correctly', () => {
      // Arrange
      const dto: AuditDetailsDto = {
        data: {
          auditId: 1,
          status: 'Open',
          siteName: 'Site 1',
          siteAddress: 'Address 1',
          startDate: '2021-01-01T00:00:00Z',
          endDate: '2021-02-01T00:00:00Z',
          leadAuditor: 'Auditor 1',
          auditorTeam: ['John Doe'],
          services: ['Service 1'],
        },
        isSuccess: true,
      };
      const reportsDto: AuditDocumentsListDto = {
        data: [
          {
            documentId: 1,
            fileName: 'L2C DCM User Guide.docx',
            type: 'Audit Plan',
            dateAdded: '2024-07-04T14:45:38',
            uploadedBy: 'John',
            canBeDeleted: false,
            currentSecurity: '10',
          },
          {
            documentId: 2,
            fileName: 'Designing_Data_Intensive_Applications_890.pdf',
            type: 'Audit Report',
            dateAdded: '2024-07-18T15:25:19',
            uploadedBy: 'Doe',
            canBeDeleted: false,
            currentSecurity: '10',
          },
        ],
        isSuccess: true,
        message: '',
      };

      // Act
      const result = AuditDetailsMapperService.mapToAuditDetailsModel(
        dto,
        reportsDto,
      );

      // Assert
      expect(result).toEqual({
        auditNumber: 1,
        header: {
          status: 'Open',
          siteName: 'Site 1',
          siteAddress: 'Address 1',
          startDate: '01.01.2021',
          endDate: '01.02.2021',
          auditor: 'Auditor 1',
          auditorTeam: ['John Doe'],
          services: 'Service 1',
          auditPlanDocId: [1],
          auditReportDocId: [2],
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

    test('should map sites list dto data to model correctly', () => {
      // Arrange
      const dto: SitesListDto = {
        data: [
          {
            siteName: 'Site name 1',
            addressLine: 'Site Address 1',
            city: 'City 1',
            country: 'Spain',
            postCode: '555111',
          },
          {
            siteName: 'Site name 2',
            addressLine: 'Site Address 2',
            city: 'City 2',
            country: 'France',
            postCode: '555222',
          },
        ],
      };

      // Act
      const result = AuditDetailsMapperService.mapToAuditSitesItemModel(dto);

      // Assert
      expect(result).toEqual([
        {
          siteName: 'Site name 1',
          siteAddress: 'Site Address 1',
          city: 'City 1',
          country: 'Spain',
          postcode: '555111',
        },
        {
          siteName: 'Site name 2',
          siteAddress: 'Site Address 2',
          city: 'City 2',
          country: 'France',
          postcode: '555222',
        },
      ]);
    });
  });

  describe('mapToAuditDocumentItemModel', () => {
    test('should return an empty array if dto.data is undefined', () => {
      // Arrange
      const dto: AuditDocumentsListDto = {
        data: undefined as unknown as [],
        isSuccess: true,
        message: '',
      };
      const hasAuditsEditPermission = true;
      const isDnvUser = false;

      // Act
      const result = AuditDetailsMapperService.mapToAuditDocumentItemModel(
        dto,
        hasAuditsEditPermission,
        isDnvUser,
      );

      // Assert
      expect(result).toEqual([]);
    });

    test('should map audit documents list dto data to model correctly when audits edits permission is true', () => {
      // Arrange
      const dto: AuditDocumentsListDto = {
        data: [
          {
            documentId: 0,
            fileName: 'File 0',
            type: 'docx',
            dateAdded: '2024-01-01',
            uploadedBy: 'DNV someusername 1',
            canBeDeleted: true,
            currentSecurity: '10',
          },
          {
            documentId: 1,
            fileName: 'File 1',
            type: 'xlsx',
            dateAdded: '2024-01-01',
            uploadedBy: 'DNV someusername 2',
            canBeDeleted: true,
            currentSecurity: '10',
          },
        ],
        isSuccess: true,
        message: 'message',
      };
      const hasAuditsEditPermission = true;
      const isDnvUser = false;

      // Act
      const result = AuditDetailsMapperService.mapToAuditDocumentItemModel(
        dto,
        hasAuditsEditPermission,
        isDnvUser,
      );

      // Assert
      expect(result).toEqual([
        {
          documentId: 0,
          fileName: 'File 0',
          fileType: 'docx',
          dateAdded: '01.01.2024',
          uploadedBy: 'DNV someusername 1',
          canBeDeleted: true,
          actions: [
            {
              label: 'download',
              iconClass: 'pi-download',
              actionType: 'download',
            },
            {
              actionType: 'delete',
              iconClass: 'pi-trash',
              label: 'delete',
            },
          ],
        },
        {
          documentId: 1,
          fileName: 'File 1',
          fileType: 'xlsx',
          dateAdded: '01.01.2024',
          uploadedBy: 'DNV someusername 2',
          canBeDeleted: true,
          actions: [
            {
              label: 'download',
              iconClass: 'pi-download',
              actionType: 'download',
            },
            {
              actionType: 'delete',
              iconClass: 'pi-trash',
              label: 'delete',
            },
          ],
        },
      ]);
    });

    test('should map audit documents list dto data to model correctly when audits edits permission is false', () => {
      // Arrange
      const dto: AuditDocumentsListDto = {
        data: [
          {
            documentId: 0,
            fileName: 'File 0',
            type: 'docx',
            dateAdded: '2024-01-01',
            uploadedBy: 'DNV someusername 1',
            canBeDeleted: true,
            currentSecurity: '10',
          },
          {
            documentId: 1,
            fileName: 'File 1',
            type: 'xlsx',
            dateAdded: '2024-01-01',
            uploadedBy: 'DNV someusername 2',
            canBeDeleted: true,
            currentSecurity: '10',
          },
        ],
        isSuccess: true,
        message: 'message',
      };
      const hasAuditsEditPermission = false;
      const isDnvUser = false;

      // Act
      const result = AuditDetailsMapperService.mapToAuditDocumentItemModel(
        dto,
        hasAuditsEditPermission,
        isDnvUser,
      );

      // Assert
      expect(result).toEqual([
        {
          documentId: 0,
          fileName: 'File 0',
          fileType: 'docx',
          dateAdded: '01.01.2024',
          uploadedBy: 'DNV someusername 1',
          canBeDeleted: true,
          actions: [
            {
              label: 'download',
              iconClass: 'pi-download',
              actionType: 'download',
            },
          ],
        },
        {
          documentId: 1,
          fileName: 'File 1',
          fileType: 'xlsx',
          dateAdded: '01.01.2024',
          uploadedBy: 'DNV someusername 2',
          canBeDeleted: true,
          actions: [
            {
              label: 'download',
              iconClass: 'pi-download',
              actionType: 'download',
            },
          ],
        },
      ]);
    });

    test('should NOT allow delete for DNV user even with edit permissions', () => {
      // Arrange
      const dto: AuditDocumentsListDto = {
        data: [
          {
            documentId: 2,
            fileName: 'File 2',
            type: 'pdf',
            dateAdded: '2024-01-01',
            uploadedBy: 'DNV user',
            canBeDeleted: true,
            currentSecurity: '10',
          },
        ],
        isSuccess: true,
        message: 'message',
      };
      const hasAuditsEditPermission = true;
      const isDnvUser = true;

      // Act
      const result = AuditDetailsMapperService.mapToAuditDocumentItemModel(
        dto,
        hasAuditsEditPermission,
        isDnvUser,
      );

      // Assert
      expect(result).toEqual([
        {
          documentId: 2,
          fileName: 'File 2',
          fileType: 'pdf',
          dateAdded: '01.01.2024',
          uploadedBy: 'DNV user',
          canBeDeleted: true,
          actions: [
            {
              label: 'download',
              iconClass: 'pi-download',
              actionType: 'download',
            },
          ],
        },
      ]);
    });
  });
});
