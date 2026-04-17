import { DestroyRef, Injector, runInInjectionContext } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Actions } from '@ngxs/store';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { of } from 'rxjs';

import {
  createDocumentStoreServiceMock,
  DocumentsStoreService,
} from '@customer-portal/data-access/documents';
import {
  createFindingDetailsStoreServiceMock,
  FindingDetailsStoreService,
} from '@customer-portal/data-access/findings';
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
  modalBreakpoints,
  SortingDirection,
  SortingMode,
} from '@customer-portal/shared';

import { FindingDocumentsComponent } from './finding-documents.component';

describe('FindingDocumentsComponent', () => {
  let component: FindingDocumentsComponent;

  const documentsStoreServiceMock: Partial<DocumentsStoreService> =
    createDocumentStoreServiceMock();
  const findingsDetailsStoreServiceMock: Partial<FindingDetailsStoreService> =
    createFindingDetailsStoreServiceMock();
  const profileStoreServiceMock: Partial<ProfileStoreService> =
    createProfileStoreServiceMock();
  const mockDialogService: Partial<DialogService> = createDialogServiceMock();
  const confirmationServiceMock: Partial<ConfirmationService> = {
    confirm: jest.fn().mockReturnValue(of(true)),
  };

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
      component = new FindingDocumentsComponent(
        mockDialogService as DialogService,
        findingsDetailsStoreServiceMock as FindingDetailsStoreService,
        createTranslationServiceMock() as TranslocoService,
        confirmationServiceMock as ConfirmationService,
        documentsStoreServiceMock as DocumentsStoreService,
        profileStoreServiceMock as ProfileStoreService,
        settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
      );
    });
  });

  test('should get the list with documents ', () => {
    // Assert
    expect(
      findingsDetailsStoreServiceMock.loadFindingDocumentsList,
    ).toHaveBeenCalled();
  });

  test('onGridConfigChanged should call updateGridConfig with correct parameter', () => {
    // Arrange
    const gridConfig: GridConfig = {
      filtering: {
        name: {
          value: [{ label: 'Alice', value: 'Alice' }],
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
      component.findingDetailsStoreService.updateGridConfig,
    ).toHaveBeenCalledWith(gridConfig);
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
      'findings.attachedDocuments.addDocument',
    );
    expect(openSpy).toHaveBeenCalledWith(AddDocumentsComponent, {
      header: 'translated text',
      width: '50vw',
      contentStyle: { overflow: 'auto' },
      breakpoints: modalBreakpoints,
      data: {
        canUploadData: false,
        errorMessages: {
          wrongFileSize: 'findings.fileUpload.fileUploadWrongSize',
          wrongFileType: 'findings.fileUpload.fileUploadWrongType',
          wrongFileNameLength: 'findings.fileUpload.fileUploadWrongNameLength',
          wrongTotalFileSize: 'findings.fileUpload.fileUploadWrongSize',
        },
      },
      templates: {
        footer: AddDocumentsFooterComponent,
      },
    });
  });
});
