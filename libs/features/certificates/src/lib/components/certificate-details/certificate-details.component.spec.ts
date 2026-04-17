import { DestroyRef, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { of, Subject } from 'rxjs';

import {
  LoggingService,
  ServiceNowService,
  SpinnerService,
} from '@customer-portal/core';
import {
  CertificateDetailsStoreService,
  createCertificateDetailsStoreServiceMock,
  DocumentMark,
} from '@customer-portal/data-access/certificates';
import {
  createSettingsCoBrowsingStoreServiceMock,
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import {
  createDestroyRefMock,
  createDialogServiceMock,
  createMessageServiceMock,
  createTranslationServiceMock,
  getToastContentBySeverity,
  GridFileActionType,
  Language,
  LanguageOption,
  MessageSeverity,
  ToastSeverity,
} from '@customer-portal/shared';

import { CertificateDownloadDialogComponent } from '../certificate-download-dialog';
import { CertificateDetailsComponent } from './certificate-details.component';

jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');

  return {
    ...actual,
    effect: jest.fn((fn) => fn()),
  };
});

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

describe('CertificateDetailsComponent', () => {
  let component: CertificateDetailsComponent;
  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();
  const mockDialogService: Partial<DialogService> = createDialogServiceMock();
  const destroyRefMock: Partial<DestroyRef> = createDestroyRefMock();
  const spinnerServiceMock: Partial<SpinnerService> = {
    setLoading: jest.fn(),
  };
  let activatedRouteMock: any;
  let paramMapSubject: Subject<any>;

  const mockProfileLanguageStoreService: Partial<ProfileLanguageStoreService> =
    {
      // Create a mock signal returning 'English'
      languageLabel: (() => 'English' as Language) as Signal<Language>,
    };

  const mockServiceNowService: Partial<ServiceNowService> = {
    openCertificateSupport: jest.fn(),
  };

  const mockLoggingService: Partial<LoggingService> = {
    logException: jest.fn(),
  };

  const mockCertificateDetailsStoreService: Partial<CertificateDetailsStoreService> =
    createCertificateDetailsStoreServiceMock();

  beforeEach(async () => {
    jest.clearAllMocks();

    paramMapSubject = new Subject();
    activatedRouteMock = {
      queryParams: of({}),
      paramMap: paramMapSubject.asObservable(),
    };

    const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
      createSettingsCoBrowsingStoreServiceMock();

    component = new CertificateDetailsComponent(
      mockCertificateDetailsStoreService as CertificateDetailsStoreService,
      mockDialogService as DialogService,
      createTranslationServiceMock() as TranslocoService,
      destroyRefMock as DestroyRef,
      messageServiceMock as MessageService,
      activatedRouteMock as ActivatedRoute,
      spinnerServiceMock as SpinnerService,
      mockServiceNowService as ServiceNowService,
      mockProfileLanguageStoreService as ProfileLanguageStoreService,
      mockLoggingService as LoggingService,
      settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
    );
  });

  test('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  test('should call subscribeToPathParamChanges on component initialization', () => {
    // Arrange
    const subscribeToQueryParamChangesSpy = jest.spyOn(
      component,
      'subscribeToPathParamChanges',
    );

    // Act
    component.ngOnInit();

    // Assert
    expect(subscribeToQueryParamChangesSpy).toHaveBeenCalled();
  });

  test('subscribeToPathParamChanges should loadCertificateDetails on path param changes', () => {
    // Arrange
    const loadCertificateDetailsSpy = jest.spyOn(
      mockCertificateDetailsStoreService,
      'loadCertificateDetails',
    );

    // Act
    component.subscribeToPathParamChanges();
    paramMapSubject.next({});

    // Assert
    expect(loadCertificateDetailsSpy).toHaveBeenCalled();
  });

  test('should set newCertificateInProgressMessages on ngAfterViewChecked', () => {
    // Arrange
    const summaryKey =
      'certificate.certificateDetails.newCertificateInProgress';
    const detailKey =
      'certificate.certificateDetails.thisCertificateMightBeUpdated';

    const mockedTranslatedSummary = 'Some summary text';
    const mockedTranslatedDetail = 'Some detail text';
    const expectedResult = [
      {
        severity: MessageSeverity.Warn,
        summary: mockedTranslatedSummary,
        detail: mockedTranslatedDetail,
        showCloseButton: true,
      },
    ];

    jest.spyOn(component['ts'], 'translate').mockImplementation((key) => {
      if (key === summaryKey) {
        return mockedTranslatedSummary;
      }

      if (key === detailKey) {
        return mockedTranslatedDetail;
      }

      return '';
    });

    // Act
    component.ngAfterViewChecked();

    // Assert
    expect(component.newCertificateInProgressMessages).toEqual(expectedResult);
  });

  test('should open the certificate in a new tab when openCertificate is called', () => {
    // Arrange
    const windowOpenSpy = jest
      .spyOn(window, 'open')
      .mockImplementation(() => null);

    // Act
    component.openCertificate();

    // Assert
    expect(windowOpenSpy).toHaveBeenCalledWith('http://example.com', '_blank');

    // Cleanup
    windowOpenSpy.mockRestore();
  });

  test('should change language when onSelectedLanguageChanged is called', () => {
    // Arrange
    const language = 'fr';
    const changeCertificateDetailsLanguageSpy = jest.spyOn(
      mockCertificateDetailsStoreService,
      'changeCertificateDetailsLanguage',
    );

    // Act
    component.onSelectedLanguageChanged(language);

    // Assert
    expect(changeCertificateDetailsLanguageSpy).toHaveBeenCalledWith(language);
  });

  test('should navigate to the new certificate when navigateToNewCertificate is called', () => {
    // Arrange
    const mockedCertificateId = 99;
    const navigateSpy = jest.spyOn(
      mockCertificateDetailsStoreService,
      'navigateToNewCertificate',
    );

    // Act
    component.navigateToNewCertificate();

    // Assert
    expect(navigateSpy).toHaveBeenCalledWith(mockedCertificateId);
  });

  test('should reset the state on destroy', () => {
    // Arrange
    const resetCertificateDetailsStateSpy = jest.spyOn(
      mockCertificateDetailsStoreService,
      'resetCertificateDetailsState',
    );

    // Act
    component.ngOnDestroy();

    // Assert
    expect(resetCertificateDetailsStateSpy).toHaveBeenCalled();
  });

  test('should return language options from certificateDetailsStoreService', () => {
    // Arrange
    const mockLanguageOptions: LanguageOption[] = [
      { code: 'en', language: 'English', isSelected: true },
      { code: 'fr', language: 'French', isSelected: false },
    ];
    jest
      .spyOn(mockCertificateDetailsStoreService, 'languageOptions')
      .mockReturnValue(mockLanguageOptions);

    // Act
    const { languages } = component;

    // Assert
    expect(languages).toEqual(mockLanguageOptions);
    expect(
      mockCertificateDetailsStoreService.languageOptions,
    ).toHaveBeenCalled();
  });

  test('should return documentMarks from certificateDetailsStoreService', () => {
    // Arrange
    const mockDocumentMarks: DocumentMark[] = [
      {
        documentMarkUrls: [{ languageCode: 'en', url: '1' }],
        service: 'Mark 1',
      },
      {
        documentMarkUrls: [{ languageCode: 'fr', url: '2' }],
        service: 'Mark 2',
      },
    ];
    jest
      .spyOn(mockCertificateDetailsStoreService, 'documentMarks')
      .mockReturnValue(mockDocumentMarks);

    // Act
    const { documentMarks } = component;

    // Assert
    expect(documentMarks).toEqual(mockDocumentMarks);
    expect(mockCertificateDetailsStoreService.documentMarks).toHaveBeenCalled();
  });

  test('should return isIssued from certificateDetailsStoreService', () => {
    // Arrange
    const mockIsIssued = true;
    jest
      .spyOn(mockCertificateDetailsStoreService, 'isCertificateStatusIssued')
      .mockReturnValue(mockIsIssued);

    // Act
    const { isIssued } = component;

    // Assert
    expect(isIssued).toEqual(mockIsIssued);
    expect(
      mockCertificateDetailsStoreService.isCertificateStatusIssued,
    ).toHaveBeenCalled();
  });

  test('should open dialog with correct parameters', () => {
    // Arrange
    const dialogRefMock = {
      onClose: of({ isSubmitted: true }),
    };
    const certificateDetailsMock = {
      certificateId: 0,
      certificateNumber: '',
      newCertificateId: 99,
      header: {
        certificateTitle: '',
        creationDate: '',
        documentMarks: [],
        issuedDate: '',
        languages: [],
        newRevisionNumber: 1,
        revisionNumber: 1,
        scopes: [],
        securityClearanceLevel: '',
        services: 'ISO 9001',
        siteAddress: '',
        siteName: '',
        status: '',
        suspendedDate: '',
        validUntilDate: '',
        withdrawnDate: '',
        qRCodeLink: '',
        projectNumber: '',
        reportingCountry: '',
      },
    };
    jest
      .spyOn(mockCertificateDetailsStoreService, 'certificateDetails')
      .mockReturnValue(certificateDetailsMock);
    jest.spyOn(mockDialogService, 'open').mockReturnValue(dialogRefMock as any);
    jest
      .spyOn((component as any).ts, 'translate')
      .mockImplementation((key) => key);

    // Act
    component.confirmDownload(true);

    // Assert
    expect(mockDialogService.open).toHaveBeenCalledWith(
      CertificateDownloadDialogComponent,
      {
        header: 'certificate.downloadDialog.markHeader',
        modal: true,
        width: '600px',
        breakpoints: {
          '640px': '90vw',
          '960px': '75vw',
        },
        styleClass: 'certificate-download-dialog',
        data: {
          label: 'certificate.downloadDialog.label',
          isDownloadCertificationMark: true,
          languages: component.certMarkLanguages,
          serviceName: component.certificateDetails().header.services,
        },
      },
    );
  });

  test('should handle dialog close event and start download if there is only one certification mark', () => {
    // Arrange
    const dialogRefMock = {
      onClose: of({ isSubmitted: true }),
    };
    const mockedCertificationMarks = [
      {
        fileName: 'ISO 9001-ISO',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'iso9001.zip',
            actionType: GridFileActionType.Download,
          },
        ],
      },
    ];
    jest.spyOn(mockDialogService, 'open').mockReturnValue(dialogRefMock as any);
    jest
      .spyOn(mockCertificateDetailsStoreService, 'allCertificationMarks')
      .mockReturnValue(mockedCertificationMarks);

    // Act
    component.confirmDownload();

    // Assert
    expect(
      mockCertificateDetailsStoreService.downloadCertificationMark,
    ).toHaveBeenCalledWith(
      mockedCertificationMarks[0].actions[0].url,
      mockedCertificationMarks[0].fileName,
    );
    expect(messageServiceMock.add).toHaveBeenCalledWith(
      getToastContentBySeverity(ToastSeverity.DownloadStart),
    );
  });

  test('should handle dialog close event and open certification mark list dialog if there is more than one certification mark', () => {
    // Arrange
    const dialogRefMock = {
      onClose: of({ isSubmitted: true }),
    };
    const mockedCertificationMarks = [
      {
        fileName: 'ISO 9001-ISO',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'iso9001.zip',
            actionType: GridFileActionType.Download,
          },
        ],
      },
      {
        fileName: 'ISO 14001-ISO',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'iso14001.zip',
            actionType: GridFileActionType.Download,
          },
        ],
      },
    ];
    const openCertificationMarksListDialogSpy = jest.spyOn(
      component,
      'openCertificationMarksListDialog',
    );
    jest.spyOn(mockDialogService, 'open').mockReturnValue(dialogRefMock as any);
    jest
      .spyOn(mockCertificateDetailsStoreService, 'allCertificationMarks')
      .mockReturnValue(mockedCertificationMarks);

    // Act
    component.confirmDownload();

    // Assert
    expect(openCertificationMarksListDialogSpy).toHaveBeenCalled();
  });

  test('should not download when dialog is not submitted', () => {
    // Arrange
    const dialogRefMock = {
      onClose: of({ isSubmitted: false }),
    };
    jest.spyOn(mockDialogService, 'open').mockReturnValue(dialogRefMock as any);

    const downloadCertificationMarkSpy = jest.spyOn(
      mockCertificateDetailsStoreService,
      'downloadCertificationMark',
    );

    // Act
    component.confirmDownload();

    // Assert
    expect(downloadCertificationMarkSpy).not.toHaveBeenCalled();
  });
});
