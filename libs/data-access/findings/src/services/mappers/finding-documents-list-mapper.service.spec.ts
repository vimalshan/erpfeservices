import { convertToUtcDate, GridFileActionType } from '@customer-portal/shared';

import { FindingDocumentsListDto } from '../../dtos';
import { FindingDocumentListItemModel } from '../../models';
import { FindingDocumentsListMapperService } from './finding-documents-list-mapper.service';

describe('FindingDocumentsListMapperService', () => {
  test('should return an empty array if dto is null', () => {
    // Arrange
    const dto: any = null;
    const findingsEditPermission = true;
    const isDnvUser = false;

    // Act
    const result =
      FindingDocumentsListMapperService.mapToFindingDocumentItemModel(
        dto,
        findingsEditPermission,
        isDnvUser,
      );

    // Assert
    expect(result).toEqual([]);
  });

  test('should return an empty array if dto is undefined', () => {
    // Arrange
    const dto: any = undefined;
    const findingsEditPermission = true;
    const isDnvUser = false;

    // Act
    const result =
      FindingDocumentsListMapperService.mapToFindingDocumentItemModel(
        dto,
        findingsEditPermission,
        isDnvUser,
      );

    // Assert
    expect(result).toEqual([]);
  });

  test('should return an empty array if dto.data is empty', () => {
    // Arrange
    const dto: FindingDocumentsListDto = {
      data: [],
      isSuccess: true,
      message: '',
    };
    const findingsEditPermission = true;
    const isDnvUser = false;

    // Act
    const result =
      FindingDocumentsListMapperService.mapToFindingDocumentItemModel(
        dto,
        findingsEditPermission,
        isDnvUser,
      );

    // Assert
    expect(result).toEqual([]);
  });

  test('should correctly map FindingDocumentListItemDto to FindingDocumentListItemModel when findings edit permission is true', () => {
    // Arrange
    const mockDate = new Date().toISOString();
    const findingsEditPermission = true;
    const dto: FindingDocumentsListDto = {
      data: [
        {
          documentId: 0,
          fileName: 'document1.pdf',
          type: 'PDF',
          dateAdded: mockDate,
          uploadedBy: 'DNV auditor1',
          documentUrl: 'http://example.com/download1',
          canBeDeleted: true,
        },
        {
          documentId: 1,
          fileName: 'document2.pdf',
          type: 'PDF',
          dateAdded: mockDate,
          uploadedBy: 'user1',
          documentUrl: 'http://example.com/download2',
          canBeDeleted: true,
        },
      ],
      isSuccess: true,
      message: '',
    };

    const expected: FindingDocumentListItemModel[] = [
      {
        documentId: 0,
        fileName: 'document1.pdf',
        fileType: 'PDF',
        dateAdded: convertToUtcDate(mockDate),
        uploadedBy: `DNV auditor1`,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'http://example.com/download1',
            actionType: GridFileActionType.Download,
          },
          {
            label: 'delete',
            iconClass: 'pi-trash',
            actionType: GridFileActionType.Delete,
          },
        ],
        canBeDeleted: true,
      },
      {
        documentId: 1,
        fileName: 'document2.pdf',
        fileType: 'PDF',
        dateAdded: convertToUtcDate(mockDate),
        uploadedBy: 'user1',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'http://example.com/download2',
            actionType: GridFileActionType.Download,
          },
          {
            label: 'delete',
            iconClass: 'pi-trash',
            actionType: GridFileActionType.Delete,
          },
        ],
        canBeDeleted: true,
      },
    ];
    const isDnvUser = false;

    // Act
    const result =
      FindingDocumentsListMapperService.mapToFindingDocumentItemModel(
        dto,
        findingsEditPermission,
        isDnvUser,
      );

    // Assert
    expect(result).toEqual(expected);
  });

  test('should correctly map FindingDocumentListItemDto to FindingDocumentListItemModel when findings edit permission is false', () => {
    // Arrange
    const mockDate = new Date().toISOString();
    const findingsEditPermission = false;
    const dto: FindingDocumentsListDto = {
      data: [
        {
          documentId: 0,
          fileName: 'document1.pdf',
          type: 'PDF',
          dateAdded: mockDate,
          uploadedBy: 'DNV auditor1',
          documentUrl: 'http://example.com/download1',
          canBeDeleted: true,
        },
        {
          documentId: 1,
          fileName: 'document2.pdf',
          type: 'PDF',
          dateAdded: mockDate,
          uploadedBy: 'user1',
          documentUrl: 'http://example.com/download2',
          canBeDeleted: true,
        },
      ],
      isSuccess: true,
      message: '',
    };

    const expected: FindingDocumentListItemModel[] = [
      {
        documentId: 0,
        fileName: 'document1.pdf',
        fileType: 'PDF',
        dateAdded: convertToUtcDate(mockDate),
        uploadedBy: `DNV auditor1`,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'http://example.com/download1',
            actionType: GridFileActionType.Download,
          },
        ],
        canBeDeleted: true,
      },
      {
        documentId: 1,
        fileName: 'document2.pdf',
        fileType: 'PDF',
        dateAdded: convertToUtcDate(mockDate),
        uploadedBy: 'user1',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'http://example.com/download2',
            actionType: GridFileActionType.Download,
          },
        ],
        canBeDeleted: true,
      },
    ];
    const isDnvUser = false;

    // Act
    const result =
      FindingDocumentsListMapperService.mapToFindingDocumentItemModel(
        dto,
        findingsEditPermission,
        isDnvUser,
      );

    // Assert
    expect(result).toEqual(expected);
  });

  test('should map uploadedBy correctly based on uploadedByAuditor flag', () => {
    // Arrange
    const mockDate = new Date().toISOString();
    const findingsEditPermission = true;
    const dto: FindingDocumentsListDto = {
      data: [
        {
          documentId: 0,
          fileName: 'document1.pdf',
          type: 'PDF',
          dateAdded: mockDate,
          uploadedBy: 'DNV auditor1',
          documentUrl: 'http://example.com/download1',
          canBeDeleted: true,
        },
      ],
      isSuccess: true,
      message: '',
    };

    const expected: FindingDocumentListItemModel[] = [
      {
        documentId: 0,
        fileName: 'document1.pdf',
        fileType: 'PDF',
        dateAdded: convertToUtcDate(mockDate),
        uploadedBy: `DNV auditor1`,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'http://example.com/download1',
            actionType: GridFileActionType.Download,
          },
          {
            actionType: GridFileActionType.Delete,
            iconClass: 'pi-trash',
            label: 'delete',
          },
        ],
        canBeDeleted: true,
      },
    ];
    const isDnvUser = false;

    // Act
    const result =
      FindingDocumentsListMapperService.mapToFindingDocumentItemModel(
        dto,
        findingsEditPermission,
        isDnvUser,
      );

    // Assert
    expect(result).toEqual(expected);
  });

  test('should add delete action if uploadedByAuditor is false and document canBeDeleted is true', () => {
    // Arrange
    const mockDate = new Date().toISOString();
    const findingsEditPermission = true;
    const dto: FindingDocumentsListDto = {
      data: [
        {
          documentId: 0,
          fileName: 'document2.pdf',
          type: 'PDF',
          dateAdded: mockDate,
          uploadedBy: 'user1',
          documentUrl: 'http://example.com/download2',
          canBeDeleted: true,
        },
        {
          documentId: 1,
          fileName: 'document3.pdf',
          type: 'PDF',
          dateAdded: mockDate,
          uploadedBy: 'user1',
          documentUrl: 'http://example.com/download3',
          canBeDeleted: false,
        },
      ],
      isSuccess: true,
      message: '',
    };

    const expected: FindingDocumentListItemModel[] = [
      {
        documentId: 0,
        fileName: 'document2.pdf',
        fileType: 'PDF',
        dateAdded: convertToUtcDate(mockDate),
        uploadedBy: 'user1',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'http://example.com/download2',
            actionType: GridFileActionType.Download,
          },
          {
            label: 'delete',
            iconClass: 'pi-trash',
            actionType: GridFileActionType.Delete,
          },
        ],
        canBeDeleted: true,
      },
      {
        documentId: 1,
        fileName: 'document3.pdf',
        fileType: 'PDF',
        dateAdded: convertToUtcDate(mockDate),
        uploadedBy: 'user1',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'http://example.com/download3',
            actionType: GridFileActionType.Download,
          },
        ],
        canBeDeleted: false,
      },
    ];
    const isDnvUser = false;

    // Act
    const result =
      FindingDocumentsListMapperService.mapToFindingDocumentItemModel(
        dto,
        findingsEditPermission,
        isDnvUser,
      );

    // Assert
    expect(result).toEqual(expected);
  });

  test('should handle missing fields in dto correctly', () => {
    // Arrange
    const mockDate = new Date().toISOString();
    const findingsEditPermission = true;
    const dto: FindingDocumentsListDto = {
      data: [
        {
          documentId: 0,
          fileName: 'document3.pdf',
          type: 'PDF',
          dateAdded: mockDate,
          uploadedByAuditor: true,
          documentUrl: 'http://example.com/download3',
          canBeDeleted: true,
        } as any, // Simulating missing uploadedBy field
      ],
      isSuccess: true,
      message: '',
    };

    const expected: FindingDocumentListItemModel[] = [
      {
        documentId: 0,
        fileName: 'document3.pdf',
        fileType: 'PDF',
        dateAdded: convertToUtcDate(mockDate),
        uploadedBy: undefined as unknown as string,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'http://example.com/download3',
            actionType: GridFileActionType.Download,
          },
          {
            label: 'delete',
            iconClass: 'pi-trash',
            actionType: GridFileActionType.Delete,
          },
        ],
        canBeDeleted: true,
      },
    ];
    const isDnvUser = false;

    // Act
    const result =
      FindingDocumentsListMapperService.mapToFindingDocumentItemModel(
        dto,
        findingsEditPermission,
        isDnvUser,
      );

    // Assert
    expect(result).toEqual(expected);
  });

  test('should NOT allow delete for DNV user even with edit permissions', () => {
    // Arrange
    const mockDate = new Date().toISOString();
    const findingsEditPermission = true;
    const dto: FindingDocumentsListDto = {
      data: [
        {
          documentId: 0,
          fileName: 'document1.pdf',
          type: 'PDF',
          dateAdded: mockDate,
          uploadedBy: 'DNV auditor1',
          documentUrl: 'http://example.com/download1',
          canBeDeleted: true,
        },
        {
          documentId: 1,
          fileName: 'document2.pdf',
          type: 'PDF',
          dateAdded: mockDate,
          uploadedBy: 'user1',
          documentUrl: 'http://example.com/download2',
          canBeDeleted: true,
        },
      ],
      isSuccess: true,
      message: '',
    };

    const expected: FindingDocumentListItemModel[] = [
      {
        documentId: 0,
        fileName: 'document1.pdf',
        fileType: 'PDF',
        dateAdded: convertToUtcDate(mockDate),
        uploadedBy: `DNV auditor1`,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'http://example.com/download1',
            actionType: GridFileActionType.Download,
          },
        ],
        canBeDeleted: true,
      },
      {
        documentId: 1,
        fileName: 'document2.pdf',
        fileType: 'PDF',
        dateAdded: convertToUtcDate(mockDate),
        uploadedBy: 'user1',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'http://example.com/download2',
            actionType: GridFileActionType.Download,
          },
        ],
        canBeDeleted: true,
      },
    ];
    const isDnvUser = true;

    // Act
    const result =
      FindingDocumentsListMapperService.mapToFindingDocumentItemModel(
        dto,
        findingsEditPermission,
        isDnvUser,
      );

    // Assert
    expect(result).toEqual(expected);
  });
});
