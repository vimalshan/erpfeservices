import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  Signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import {
  CertificateDetailsStoreService,
  CertificateDownloadDialogData,
} from '@customer-portal/data-access/certificates';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { LanguageOption } from '@customer-portal/shared/models';

import { CertificateGuidelines } from '../../constants';

@Component({
  selector: 'lib-certificate-download-dialog',
  providers: [DialogService],
  imports: [
    CommonModule,
    TranslocoDirective,
    DropdownModule,
    FormsModule,
    DialogModule,
    SharedButtonComponent,
  ],
  templateUrl: './certificate-download-dialog.component.html',
  styleUrl: './certificate-download-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateDownloadDialogComponent implements OnInit {
  selectedLanguage!: LanguageOption;
  dialogData!: CertificateDownloadDialogData;
  isViewCertificationGuidelinesEnabled = true;
  guidelineUrl!: string;
  sharedButtonType = SharedButtonType;
  isCertmarkDownloadReady: Signal<boolean> = computed(
    () =>
      !!this.certificateDetailsStoreService.allCertificationMarks()?.[0]
        ?.fileName,
  );

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private certificateDetailsStoreService: CertificateDetailsStoreService,
  ) {
    this.dialogData = config?.data;
    this.selectedLanguage = this.config?.data?.languages?.find(
      (l: LanguageOption) => l.isSelected,
    );
  }

  ngOnInit(): void {
    if (this.selectedLanguage) {
      this.onUpdateLanguage({ value: this.selectedLanguage });
      this.onUpdateCertificationMarkGuidelineUrl(
        this.selectedLanguage.language,
      );
    }
  }

  onDownload(): void {
    this.ref.close({
      isSubmitted: true,
      languageCode: this.selectedLanguage.code || '',
    });
  }

  onViewCertificationMarkGuidelines(): void {
    if (this.isViewCertificationGuidelinesEnabled) {
      window.open(this.guidelineUrl, '_blank');
    }
  }

  onClose(): void {
    this.ref.close({ isSubmitted: false });
  }

  onUpdateLanguage(event: { value: LanguageOption }): void {
    this.certificateDetailsStoreService.resetAllCertificationMarks();
    this.certificateDetailsStoreService.loadAllCertificationMarks(
      this.dialogData.serviceName,
      event.value.language,
    );
    this.onUpdateCertificationMarkGuidelineUrl(event.value.language);
  }

  private onUpdateCertificationMarkGuidelineUrl(language: string): void {
    this.guidelineUrl =
      CertificateGuidelines[language as keyof typeof CertificateGuidelines];
    this.isViewCertificationGuidelinesEnabled = !!this.guidelineUrl;
  }
}
