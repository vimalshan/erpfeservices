import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import {
  createRouteStoreServiceMock,
  RouteStoreService,
} from '@customer-portal/router';
import {
  createFileSaverMock,
  createMessageServiceMock,
  getTranslocoModule,
} from '@customer-portal/shared';

import { DocumentsService } from '../services/documents.service';
import { DeleteDocument, DownloadDocument } from './documents.actions';
import { DocumentsState } from './documents.state';

describe('DocumentState', () => {
  const documentId = 1;
  const fileName = 'test.pdf';
  let store: Store;
  const documentServiceMock = {
    downloadDocument: jest.fn().mockReturnValue(of({})),
    deleteDocument: jest.fn().mockRejectedValue(of({})),
  };

  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();

  beforeEach(() => {
    jest.clearAllMocks();

    createFileSaverMock();

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([DocumentsState]), getTranslocoModule()],
      providers: [
        {
          provide: DocumentsService,
          useValue: documentServiceMock,
        },
        {
          provide: RouteStoreService,
          useValue: createRouteStoreServiceMock(),
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
      ],
    });

    store = TestBed.inject(Store);
  });

  test('should request document download and show success message', () => {
    // Arrange
    const mockBlob = new Blob();
    documentServiceMock.downloadDocument = jest.fn().mockReturnValueOnce(
      of({
        blob: mockBlob,
        headers: new Headers({
          'content-disposition': `filename="${fileName}"`,
        }),
      }),
    );

    // Act
    store.dispatch(new DownloadDocument(documentId, fileName));

    // Assert
    expect(documentServiceMock.downloadDocument).toHaveBeenCalledWith(
      documentId,
      fileName,
    );
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' }),
    );
  });

  test('should request document download and show error message', () => {
    // Arrange
    jest.spyOn(console, 'error').mockImplementationOnce(() => {});
    documentServiceMock.downloadDocument = jest
      .fn()
      .mockReturnValue(throwError(() => new Error('test 404 error')));

    // Act
    store.dispatch(new DownloadDocument(documentId, fileName));

    // Assert
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error' }),
    );
  });

  test('should request delete document and show success message', () => {
    // Arrange
    documentServiceMock.deleteDocument = jest.fn().mockReturnValueOnce(
      of({
        isSuccess: true,
      }),
    );

    // Act
    store.dispatch(new DeleteDocument('randomServiceName', '1', documentId));

    // Assert
    expect(documentServiceMock.deleteDocument).toHaveBeenCalledWith(
      'randomServiceName',
      '1',
      documentId,
    );
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' }),
    );
  });

  test('should request delete document and show error message for handled errors', () => {
    // Arrange
    documentServiceMock.deleteDocument = jest.fn().mockReturnValueOnce(
      of({
        isSuccess: false,
      }),
    );

    // Act
    store.dispatch(new DeleteDocument('randomServiceName', '1', documentId));

    // Assert
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error' }),
    );
  });

  test('should request delete document and show error message for unhandled errors', () => {
    // Arrange
    jest.spyOn(console, 'error').mockImplementationOnce(() => {});
    documentServiceMock.deleteDocument = jest
      .fn()
      .mockReturnValue(throwError(() => new Error('test 404 error')));

    // Act
    store.dispatch(new DeleteDocument('randomServiceName', '1', documentId));

    // Assert
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error' }),
    );
  });
});
