import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  DestroyRef,
  effect,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';

import {
  CertificateParams,
  LoggingService,
  ServiceNowService,
  SpinnerService,
} from '@customer-portal/core';
import {
  CERTIFICATE_STATUS_MAP,
  CertificateDetailsStoreService,
  CertificateDownloadDialogSubmitData,
  CertificateStatus,
  DocumentMark,
} from '@customer-portal/data-access/certificates';
import {
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
} from '@customer-portal/data-access/settings';
import {
  LanguageSwitcherComponent,
  MessageComponent,
  MessageModel,
  MessageSeverity,
  SharedButtonComponent,
  SharedButtonType,
  StatusComponent,
} from '@customer-portal/shared/components';
import { modalBreakpoints } from '@customer-portal/shared/constants';
import {
  ADMIN_PERMISSION_CHECKER,
  HasAdminPermissionDirective,
} from '@customer-portal/shared/directives/permissions';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import { LanguageOption, ToastSeverity } from '@customer-portal/shared/models';
import { CustomDatePipe } from '@customer-portal/shared/pipes/custom-date.pipe';

import { CertificateMarkLanguageList } from '../../constants';
import { CertificateDownloadDialogComponent } from '../certificate-download-dialog';
import { CertificateMarkDownloadListDialogComponent } from '../certificate-mark-download-list-dialog';
import { CertificateSuspensionMessageModalComponent } from '../certificate-suspension-message-modal';
import { CertificateSuspensionMessageModalFooterComponent } from '../certificate-suspension-message-modal-footer';
import { CertificateTabViewComponent } from '../certificate-tab-view';

@Component({
  selector: 'lib-certificate-details',
  imports: [
    TranslocoDirective,
    LanguageSwitcherComponent,
    CertificateTabViewComponent,
    StatusComponent,
    SharedButtonComponent,
    CommonModule,
    MessageComponent,
    HasAdminPermissionDirective,
    CustomDatePipe,
  ],
  providers: [
    CertificateDetailsStoreService,
    DialogService,
    {
      provide: ADMIN_PERMISSION_CHECKER,
      useExisting: SettingsCompanyDetailsStoreService,
    },
  ],
  templateUrl: './certificate-details.component.html',
  styleUrls: ['./certificate-details.component.scss'],
})
export class CertificateDetailsComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  private hasTriggeredCertificateSuspensionMessage = false;

  certificateDetails = this.certificateDetailsStoreService.certificateDetails;
  certMarkLanguages = CertificateMarkLanguageList;
  siteScope = this.certificateDetailsStoreService.siteScope;
  hasNewRevisionNumber =
    this.certificateDetailsStoreService.hasNewRevisionNumber;
  statusStatesMap = CERTIFICATE_STATUS_MAP;
  newCertificateInProgressMessages: MessageModel[] = [];
  isLoading = this.spinnerService.isLoading$;
  sharedButtonType = SharedButtonType;
  isDnvUser = this.settingsCoBrowsingStoreService.isDnvUser;
  isOutstandingStatus = false;

  constructor(
    private certificateDetailsStoreService: CertificateDetailsStoreService,
    private dialogService: DialogService,
    private ts: TranslocoService,
    private destroyRef: DestroyRef,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: SpinnerService,
    private serviceNowService: ServiceNowService,
    private profileLanguageStoreService: ProfileLanguageStoreService,
    private loggingService: LoggingService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
  ) {
    effect(() => {
      const certificateDetailsHeader = this.certificateDetails().header;

      if (
        certificateDetailsHeader &&
        certificateDetailsHeader.status.toLowerCase() ===
          CertificateStatus.Suspended.toLowerCase() &&
        !this.hasTriggeredCertificateSuspensionMessage
      ) {
        this.openCertificateSuspensionDialog();
        this.hasTriggeredCertificateSuspensionMessage = true;
      }

      this.isOutstandingStatus =
        certificateDetailsHeader.status.toLowerCase() ===
        CertificateStatus.OutstandingInvoices.toLowerCase();
    });
  }

  ngOnInit(): void {
    this.subscribeToPathParamChanges();
  }

  ngAfterViewChecked(): void {
    this.newCertificateInProgressMessages = [
      {
        severity: MessageSeverity.Warn,
        summary: this.ts.translate(
          'certificate.certificateDetails.newCertificateInProgress',
        ),
        detail: this.ts.translate(
          'certificate.certificateDetails.thisCertificateMightBeUpdated',
        ),
        showCloseButton: true,
      },
    ];
  }

  get languages(): LanguageOption[] {
    return this.certificateDetailsStoreService.languageOptions();
  }

  get documentMarks(): DocumentMark[] | undefined {
    return this.certificateDetailsStoreService.documentMarks();
  }

  get isIssued(): boolean | undefined {
    return this.certificateDetailsStoreService.isCertificateStatusIssued();
  }

  subscribeToPathParamChanges(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.certificateDetailsStoreService.loadCertificateDetails();
      });
  }

  onSelectedLanguageChanged(language: string): void {
    this.certificateDetailsStoreService.changeCertificateDetailsLanguage(
      language,
    );
  }

  openCertificate(): void {
    window.open(this.certificateDetails().header.qRCodeLink, '_blank');
  }

  confirmDownload(isDownloadCertificationMark?: boolean): void {
    this.dialogService
      .open(CertificateDownloadDialogComponent, {
        header: isDownloadCertificationMark
          ? this.ts.translate('certificate.downloadDialog.markHeader')
          : this.ts.translate('certificate.downloadDialog.header'),
        modal: true,
        width: '600px',
        breakpoints: modalBreakpoints,
        styleClass: 'certificate-download-dialog',
        data: {
          label: this.ts.translate('certificate.downloadDialog.label'),
          isDownloadCertificationMark,
          languages: this.certMarkLanguages,
          serviceName: this.certificateDetails().header.services,
        },
      })
      .onClose.pipe(take(1))
      .subscribe((data: CertificateDownloadDialogSubmitData) => {
        if (!data || !data.isSubmitted) return;

        const allCertificationMarks =
          this.certificateDetailsStoreService.allCertificationMarks();

        if (allCertificationMarks.length === 1) {
          const {
            fileName,
            actions: [{ url }],
          } = allCertificationMarks[0];

          this.certificateDetailsStoreService.downloadCertificationMark(
            url as string,
            fileName,
          );

          this.messageService.add(
            getToastContentBySeverity(ToastSeverity.DownloadStart),
          );
        } else {
          this.openCertificationMarksListDialog();
        }
      });
  }

  openCertificationMarksListDialog(): void {
    this.dialogService
      .open(CertificateMarkDownloadListDialogComponent, {
        header: this.ts.translate('certificate.downloadDialog.markHeader'),
        modal: true,
        width: '55vw',
        breakpoints: modalBreakpoints,
        styleClass: 'certificate-marks-download-list-dialog',
      })
      .onClose.pipe(take(1))
      .subscribe((isBack: boolean) => {
        if (isBack) {
          this.confirmDownload(true);
        }
      });
  }

  openCertificateSuspensionDialog(): void {
    this.dialogService
      .open(CertificateSuspensionMessageModalComponent, {
        header: this.ts.translate(
          'certificate.certificateSuspension.certificateSuspensionTitle',
        ),
        modal: true,
        width: '55vw',
        breakpoints: modalBreakpoints,
        data: {
          certificateNumber: this.certificateDetails().certificateNumber,
          siteName: this.certificateDetails().header.siteName,
          services: this.certificateDetails().header.services,
          suspensionDate: this.certificateDetails().header.suspendedDate,
        },
        templates: {
          footer: CertificateSuspensionMessageModalFooterComponent,
        },
      })
      .onClose.pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.openserviceNowCertificateSupport();
        }
      });
  }

  navigateToNewCertificate(): void {
    this.certificateDetailsStoreService.navigateToNewCertificate(
      this.certificateDetailsStoreService.newCertificateId(),
    );
  }

  ngOnDestroy(): void {
    this.certificateDetailsStoreService.resetCertificateDetailsState();
  }

  openserviceNowCertificateSupport(): void {
    try {
      const certificateParams: CertificateParams = {
        certificateNumber: this.certificateDetails().certificateNumber,
        revisionNumber: this.certificateDetails().header.revisionNumber,
        certificateID: this.certificateDetails().certificateId,
        accountDNVId: this.certificateDetails().accountDNVId,
        certificateStatus: this.certificateDetails().header.status,
        language: this.profileLanguageStoreService.languageLabel(),
        service: this.certificateDetails().header.services,
        reportingCountry: this.certificateDetails().header.reportingCountry,
        projectNumber: this.certificateDetails().header.projectNumber,
      };
      this.serviceNowService.openCertificateSupport(certificateParams);
    } catch (error) {
      const message = getToastContentBySeverity(ToastSeverity.Error);
      message.summary = this.ts.translate('serviceNow.error');
      this.messageService.add(message);
      this.loggingService.logException(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}
