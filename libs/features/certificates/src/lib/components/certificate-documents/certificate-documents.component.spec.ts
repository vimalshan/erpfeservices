import {
  CertificateDetailsStoreService,
  CertificateDocumentsListItemModel,
  createCertificateDetailsStoreServiceMock,
} from '@customer-portal/data-access/certificates';
import {
  createDocumentStoreServiceMock,
  DocType,
  DocumentsStoreService,
} from '@customer-portal/data-access/documents';
import {
  FilterMode,
  FilterOperator,
  GridConfig,
  GridFileActionEvent,
  GridFileActionType,
  SortingDirection,
  SortingMode,
} from '@customer-portal/shared';

import { CertificateDocumentsComponent } from './certificate-documents.component';

describe('CertificateDocumentsComponent', () => {
  let component: CertificateDocumentsComponent;
  const mockCertificateDetailsStoreService: Partial<CertificateDetailsStoreService> =
    createCertificateDetailsStoreServiceMock();
  const documentsStoreServiceMock: Partial<DocumentsStoreService> =
    createDocumentStoreServiceMock();

  beforeEach(async () => {
    component = new CertificateDocumentsComponent(
      mockCertificateDetailsStoreService as CertificateDetailsStoreService,
      documentsStoreServiceMock as DocumentsStoreService,
    );
  });

  test('should call loadCertificateDocumentsList on component initialization', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      mockCertificateDetailsStoreService.loadCertificateDocumentsList,
    ).toHaveBeenCalled();
  });

  test('should call updateCertificateDocumentsListGridConfig with correct config', () => {
    // Arrange
    const mockGridConfig: GridConfig = {
      sorting: {
        mode: SortingMode.Single,
        rules: [{ field: 'name', direction: SortingDirection.Ascending }],
      },
      filtering: {
        name: {
          value: [
            {
              label: 'label1',
              value: 'value1',
            },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      },
      pagination: {
        paginationEnabled: true,
        startIndex: 0,
        pageSize: 10,
      },
    };

    // Act
    component.onGridConfigChanged(mockGridConfig);

    // Assert
    expect(
      mockCertificateDetailsStoreService.updateCertificateDocumentsListGridConfig,
    ).toHaveBeenCalledWith(mockGridConfig);
  });

  describe('onSelectionChangeData', () => {
    test('should hide download button and clear selected IDs when no documents are selected', () => {
      // Act
      component.onSelectionChangeData([]);

      // Assert
      expect(component.displayDownloadButton).toBe(false);
      expect(component.selectedDocumentsIds).toEqual([]);
    });

    test('should show download button and set selected document IDs when documents are selected', () => {
      // Arrange
      const docs: CertificateDocumentsListItemModel[] = [
        {
          documentId: 1,
          fileName: 'file1.pdf',
          type: 'PDF',
          dateAdded: '2023-04-10',
          uploadedBy: 'User A',
          language: 'EN',
          canBeDeleted: true,
          currentSecurity: 'Public',
          contactEmail: 'a@example.com',
          actions: [],
        },
        {
          documentId: 2,
          fileName: 'file2.pdf',
          type: 'PDF',
          dateAdded: '2023-04-11',
          uploadedBy: 'User B',
          language: 'FR',
          canBeDeleted: false,
          currentSecurity: 'Private',
          contactEmail: 'b@example.com',
          actions: [],
        },
      ];

      // Act
      component.onSelectionChangeData(docs);

      // Assert
      expect(component.displayDownloadButton).toBe(true);
      expect(component.selectedDocumentsIds).toEqual([1, 2]);
    });
  });

  test('should call downloadAllDocuments with selected document IDs and DocType.Certificate', () => {
    // Arrange
    const selectedDocumentsIds = [10, 20, 30];
    component.selectedDocumentsIds = selectedDocumentsIds;

    // Act
    component.downloadSelectedDocuments();

    // Assert
    expect(documentsStoreServiceMock.downloadAllDocuments).toHaveBeenCalledWith(
      selectedDocumentsIds,
      DocType.Certificate,
    );
  });

  test('should trigger file download when action type is Download', () => {
    // Arrange
    const documentId = 123;
    const fileName = 'test-document.pdf';
    const event = {
      actionType: GridFileActionType.Download,
    } as GridFileActionEvent;
    const spyDownloadDocument = jest.spyOn(
      documentsStoreServiceMock,
      'downloadDocument',
    );

    // Act
    component.triggerFileAction({ event, fileName, documentId });

    // Assert
    expect(spyDownloadDocument).toHaveBeenCalledWith(documentId, fileName);
    spyDownloadDocument.mockRestore();
  });

  test('should not trigger file download when action type is not Download', () => {
    // Arrange
    const documentId = 123;
    const fileName = 'test-document.pdf';
    const event = {
      actionType: GridFileActionType.Delete,
    } as GridFileActionEvent;
    const spyDownloadDocument = jest.spyOn(
      documentsStoreServiceMock,
      'downloadDocument',
    );

    // Act
    component.triggerFileAction({ event, fileName, documentId });

    // Assert
    expect(spyDownloadDocument).not.toHaveBeenCalled();
  });
});
