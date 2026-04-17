import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { DocumentsStoreService } from '@customer-portal/data-access/documents';

import { AddDocumentsFooterComponent } from './add-documents-footer.component';

jest.mock('@customer-portal/data-access/documents');

describe('AddDocumentsFooterComponent', () => {
  let component: AddDocumentsFooterComponent;
  let mockDialogRef: jest.Mocked<DynamicDialogRef>;
  let mockDocumentsStoreService: jest.Mocked<DocumentsStoreService>;

  beforeEach(() => {
    mockDialogRef = { close: jest.fn() } as any;
    mockDocumentsStoreService = { canUploadData: jest.fn(() => true) } as any;

    component = new AddDocumentsFooterComponent(
      mockDialogRef,
      mockDocumentsStoreService,
    );
  });

  test('should create the component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  test('should initialize canUploadData from DocumentsStoreService', () => {
    // Assert
    expect(component.canUploadData).toBeTruthy();
  });

  test('should call closeDialog with correct data', () => {
    // Arrange
    const testData = true;

    // Act
    component.closeDialog(testData);

    // Assert
    expect(mockDialogRef.close).toHaveBeenCalledWith(testData);
  });
});
