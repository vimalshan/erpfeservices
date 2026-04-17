import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map, Observable } from 'rxjs';

import {
  CertificateDetailsStoreService,
  CertificatesDetailsService,
  CertificationMarksListItemModel,
} from '@customer-portal/data-access/certificates';
import {
  DownloadType,
  DownloadTypeName,
} from '@customer-portal/data-access/documents';
import { DocumentQueueService } from '@customer-portal/data-access/documents/services';
import { SettingsCoBrowsingStoreService } from '@customer-portal/data-access/settings';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { GridComponent } from '@customer-portal/shared/components/grid';
import {
  animateFlyToDownload,
  getContentType,
} from '@customer-portal/shared/helpers/download';
import {
  ColumnDefinition,
  GridFileActionType,
} from '@customer-portal/shared/models';

import { CERTIFICATE_MARKS_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-certificate-download-dialog',
  providers: [DialogService],
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedButtonComponent,
    GridComponent,
  ],
  templateUrl: './certificate-mark-download-list-dialog.component.html',
  styleUrl: './certificate-mark-download-list-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateMarkDownloadListDialogComponent implements OnInit {
  certificationMarks!: Signal<CertificationMarksListItemModel[]>;

  cols: ColumnDefinition[] = CERTIFICATE_MARKS_LIST_COLUMNS;
  sharedButtonType = SharedButtonType;

  constructor(
    private ref: DynamicDialogRef,
    private messageService: MessageService,
    private certificateDetailsStoreService: CertificateDetailsStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private certificatesDetailsService: CertificatesDetailsService,
    private documentQueueService: DocumentQueueService,
  ) {}

  ngOnInit(): void {
    this.certificationMarks =
      this.certificateDetailsStoreService.allCertificationMarks;

    this.documentQueueService.registerDownloadHandler(
      DownloadType.CertificationMark,
      this.createCertificationMarkDownloadHandler(),
    );
  }

  onClose(): void {
    this.ref.close(true);
  }

  triggerFileAction(event: any): void {
    const {
      fileName,
      event: { actionType, url, element },
    } = event;

    if (actionType === GridFileActionType.Download) {
      this.documentQueueService.addDownloadTask(
        DownloadType.CertificationMark,
        DownloadTypeName.CertificationMark,
        fileName,
        { url },
      );
      if (element) animateFlyToDownload(element);
    }
  }

  private createCertificationMarkDownloadHandler(): (
    data: { url: string },
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.certificatesDetailsService.downloadCertificationMark(data.url).pipe(
        map((response: any) => {
          const blobArray = response?.data;
          const fileExtension = getContentType(data.url, true);
          const constructedFileName = `${fileName}.${fileExtension}`;
          const blob = new Blob([new Uint8Array(blobArray)]);

          return {
            blob,
            fileName: constructedFileName,
          };
        }),
      );
  }
}
