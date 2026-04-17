import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  CertificateDetailsStoreService,
  createCertificateDetailsStoreServiceMock,
} from '@customer-portal/data-access/certificates';
import {
  createSettingsCoBrowsingStoreServiceMock,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import {
  createMessageServiceMock,
  getToastContentBySeverity,
  GridFileActionType,
  ToastSeverity,
} from '@customer-portal/shared';

import { CertificateMarkDownloadListDialogComponent } from './certificate-mark-download-list-dialog.component';

describe('CertificateDownloadDialogComponent', () => {
  let component: CertificateMarkDownloadListDialogComponent;
  const mockDynamicDialogRef = {};
  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();
  const certificateDetailsStoreServicemock: Partial<CertificateDetailsStoreService> =
    createCertificateDetailsStoreServiceMock();
  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(async () => {
    component = new CertificateMarkDownloadListDialogComponent(
      mockDynamicDialogRef as DynamicDialogRef,
      messageServiceMock as MessageService,
      certificateDetailsStoreServicemock as CertificateDetailsStoreService,
      settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
    );
  });

  test('should tap into allCertificationMarks method on component initialization and correctly update certificationMarks', () => {
    // Arrange
    const mockedCertificationMarks = [
      {
        fileName: 'ISO9001',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'ISO9001.zip',
            actionType: GridFileActionType.Download,
          },
        ],
      },
      {
        fileName: 'ISO14001',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'ISO14001.zip',
            actionType: GridFileActionType.Download,
          },
        ],
      },
      {
        fileName: 'ISO45000',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'ISO45000.zip',
            actionType: GridFileActionType.Download,
          },
        ],
      },
    ];

    jest
      .spyOn(certificateDetailsStoreServicemock, 'allCertificationMarks')
      .mockReturnValue(mockedCertificationMarks);

    // Act
    component.ngOnInit();

    // Assert
    expect(component.certificationMarks()).toEqual(mockedCertificationMarks);
  });

  test('should trigger file action and show toast when triggerFileAction is called', () => {
    // Arrange
    const mockEvent = {
      fileName: 'ISO9001',
      event: {
        actionType: GridFileActionType.Download,
        url: 'ISO9001.zip',
      },
    };
    const downloadCertificationMarkSpy = jest.spyOn(
      certificateDetailsStoreServicemock,
      'downloadCertificationMark',
    );

    // Act
    component.triggerFileAction(mockEvent);

    // Assert
    expect(downloadCertificationMarkSpy).toHaveBeenCalledWith(
      mockEvent.event.url,
      mockEvent.fileName,
    );
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      getToastContentBySeverity(ToastSeverity.DownloadStart),
    );
  });
});
