import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';

import {
  createDocumentStoreServiceMock,
  DocumentsStoreService,
} from '@customer-portal/data-access/documents';
import {
  createMessageServiceMock,
  createTranslationServiceMock,
} from '@customer-portal/shared';

import { AddDocumentsComponent } from './add-documents.component';

describe('AddDocumentsComponent', () => {
  let component: AddDocumentsComponent;
  const documentsStoreServiceMock: Partial<DocumentsStoreService> =
    createDocumentStoreServiceMock();
  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();
  let mockDynamicDialogRef: Partial<DynamicDialogRef>;
  const mockDynamicDialogConfig = {
    data: {
      errorMessages: {
        wrongFileSize: 'findings.fileUpload.fileUploadWrongSize',
        wrongFileType: 'findings.fileUpload.fileUploadWrongType',
        wrongFileNameLength: 'findings.fileUpload.fileUploadWrongNameLength',
        wrongTotalFileSize: 'findings.fileUpload.fileUploadWrongSize',
      },
    },
  };

  beforeEach(async () => {
    const mockedTranslocoService: Partial<TranslocoService> =
      createTranslationServiceMock();
    mockDynamicDialogRef = {
      onClose: of(),
    };

    component = new AddDocumentsComponent(
      mockDynamicDialogConfig as DynamicDialogConfig,
      messageServiceMock as MessageService,
      mockDynamicDialogRef as DynamicDialogRef,
      mockedTranslocoService as TranslocoService,
      documentsStoreServiceMock as DocumentsStoreService,
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
