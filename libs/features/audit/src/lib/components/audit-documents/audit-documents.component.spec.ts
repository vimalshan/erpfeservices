import { DestroyRef, Injector, runInInjectionContext } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Actions } from '@ngxs/store';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EMPTY, of } from 'rxjs';

import {
  AuditDetailsStoreService,
  createAuditDetailsStoreServiceMock,
} from '@customer-portal/data-access/audit';
import {
  createDocumentStoreServiceMock,
  DocumentsStoreService,
} from '@customer-portal/data-access/documents';
import {
  createProfileStoreServiceMock,
  createSettingsCoBrowsingStoreServiceMock,
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import {
  AddDocumentsComponent,
  AddDocumentsFooterComponent,
} from '@customer-portal/features/upload';
import {
  createActionsMock,
  createDestroyRefMock,
  createDialogServiceMock,
  createTranslationServiceMock,
  FilterMode,
  FilterOperator,
  GridConfig,
  GridFileActionEvent,
  GridFileActionType,
  modalBreakpoints,
  SortingDirection,
  SortingMode,
} from '@customer-portal/shared';

import { AuditDocumentsComponent } from './audit-documents.component';

describe('AuditDocumentsComponent', () => {
  let component: AuditDocumentsComponent;
  const auditDetailsStoreServiceMock: Partial<AuditDetailsStoreService> =
    createAuditDetailsStoreServiceMock();

  const documentsStoreServiceMock: Partial<DocumentsStoreService> =
    createDocumentStoreServiceMock();

  const confirmationServiceMock: Partial<ConfirmationService> = {
    confirm: jest.fn().mockReturnValue(of(true)),
  };

  const mockDialogService: Partial<DialogService> = createDialogServiceMock();

  const profileStoreServiceMock: Partial<ProfileStoreService> =
    createProfileStoreServiceMock();

  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(async () => {
    const injector = Injector.create({
      providers: [
        { provide: Actions, useValue: createActionsMock() },
        { provide: DestroyRef, useValue: createDestroyRefMock() },
      ],
    });

    runInInjectionContext(injector, () => {
      component = new AuditDocumentsComponent(
        auditDetailsStoreServiceMock as AuditDetailsStoreService,
        mockDialogService as DialogService,
        createTranslationServiceMock() as TranslocoService,
        confirmationServiceMock as ConfirmationService,
        documentsStoreServiceMock as DocumentsStoreService,
        profileStoreServiceMock as ProfileStoreService,
        settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
      );
    });
  });

  test('should get the list with documents', () => {
    // Assert
    expect(
      auditDetailsStoreServiceMock.loadAuditDocumentsList,
    ).toHaveBeenCalled();
  });

  test('onGridConfigChanged should call updateAuditDocumentsListGridConfig with correct parameter', () => {
    // Arrange
    const gridConfig: GridConfig = {
      filtering: {
        name: {
          value: [{ label: 'Test', value: 'Test' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      },
      sorting: {
        mode: SortingMode.Single,
        rules: [
          {
            direction: SortingDirection.Ascending,
            field: 'name',
          },
        ],
      },
      pagination: { startIndex: 0, pageSize: 2, paginationEnabled: true },
    };

    // Act
    component.onGridConfigChanged(gridConfig);

    // Assert
    expect(
      component.auditDetailsStoreService.updateAuditDocumentsListGridConfig,
    ).toHaveBeenCalledWith(gridConfig);
  });

  test('ngOnDestroy should close dialog if ref exists', () => {
    // Arrange
    component.ref = {
      close: jest.fn(),
    } as unknown as DynamicDialogRef;

    // Act
    component.ngOnDestroy();

    // Assert
    expect(component.ref.close).toHaveBeenCalled();
  });

  test('ngOnDestroy should not throw error if ref does not exist', () => {
    // Arrange
    component.ref = undefined;

    // Assert
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  test('openAddDocumentsDialog should open dialog with correct parameters', () => {
    // Arrange
    const openSpy = jest.spyOn(mockDialogService, 'open');
    const translateSpy = jest
      .spyOn((component as any).ts, 'translate')
      .mockReturnValue('translated text');

    // Act
    component.openAddDocumentsDialog();

    // Assert
    expect(translateSpy).toHaveBeenCalledWith(
      'audit.attachedDocuments.addDocument',
    );
    expect(openSpy).toHaveBeenCalledWith(AddDocumentsComponent, {
      header: 'translated text',
      width: '50vw',
      contentStyle: { overflow: 'auto' },
      breakpoints: modalBreakpoints,
      data: {
        canUploadData: false,
        errorMessages: {
          wrongFileSize: 'audit.fileUpload.fileUploadWrongSize',
          wrongFileType: 'audit.fileUpload.fileUploadWrongType',
          wrongFileNameLength: 'audit.fileUpload.fileUploadWrongNameLength',
          wrongTotalFileSize: 'audit.fileUpload.fileUploadWrongSize',
        },
      },
      templates: {
        footer: AddDocumentsFooterComponent,
      },
    });
  });

  test('should call downloadDocument when actionType is Download', () => {
    // Arrange
    const downloadSpy = jest.spyOn(
      documentsStoreServiceMock,
      'downloadDocument',
    );
    const event: GridFileActionEvent = {
      actionType: GridFileActionType.Download,
    };
    const fileName = 'test-file.pdf';
    const documentId = 123;

    // Act
    component.triggerFileAction({ event, fileName, documentId });

    // Assert
    expect(downloadSpy).toHaveBeenCalledWith(documentId, fileName);
  });

  test('should call confirmationService.confirm when actionType is Delete', () => {
    // Arrange
    const confirmSpy = jest.spyOn(confirmationServiceMock, 'confirm');
    const deleteSpy = jest
      .spyOn(documentsStoreServiceMock, 'deleteDocument')
      .mockReturnValue(EMPTY);
    const loadAuditDocumentsListSpy = jest.spyOn(
      component.auditDetailsStoreService,
      'loadAuditDocumentsList',
    );
    const event: GridFileActionEvent = {
      actionType: GridFileActionType.Delete,
    };
    const fileName = 'test-file.pdf';
    const serviceName = 'auditId';
    const serviceId = '1';
    const documentId = 123;

    // Act
    component.triggerFileAction({ event, fileName, documentId });

    // Assert
    expect(confirmSpy).toHaveBeenCalled();

    // Act
    // Simulate user accepting the confirmation dialog
    if (
      confirmSpy.mock.calls[0] &&
      confirmSpy.mock.calls[0][0] &&
      confirmSpy.mock.calls[0][0].accept
    ) {
      confirmSpy.mock.calls[0][0].accept();
    }

    // Assert
    expect(deleteSpy).toHaveBeenCalledWith(serviceName, serviceId, documentId);
    expect(loadAuditDocumentsListSpy).toHaveBeenCalled();
  });
});
