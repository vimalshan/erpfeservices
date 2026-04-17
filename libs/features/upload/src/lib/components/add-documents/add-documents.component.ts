import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Message, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  FileSelectEvent,
  FileUpload,
  FileUploadModule,
} from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

import { DocumentsStoreService } from '@customer-portal/data-access/documents/state';
import { ToastSeverity } from '@customer-portal/shared';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import {
  ErrorMessages,
  validateFileHelper,
} from '@customer-portal/shared/helpers/upload';

@Component({
  selector: 'lib-add-documents',
  imports: [
    FileUploadModule,
    SharedButtonComponent,
    BadgeModule,
    ProgressBarModule,
    ToastModule,
    CommonModule,
    TranslocoDirective,
  ],
  templateUrl: './add-documents.component.html',
  styleUrl: './add-documents.component.scss',
})
export class AddDocumentsComponent {
  readonly MAX_FILE_SIZE = 4 * 1024 * 1024 * 1024; // 4GB

  errorMessages!: ErrorMessages;
  files: File[] = [];
  totalSize = 0;
  sharedButtonType = SharedButtonType;

  errorMapper = new Map<string, string[]>();
  uploadMapper = new Map<string, boolean>();

  constructor(
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private ts: TranslocoService,
    private documentsStoreService: DocumentsStoreService,
  ) {
    this.errorMessages = this.config.data.errorMessages;

    this.ref.onClose.subscribe((data: boolean) => {
      if (data && this.errorMapper.size === 0) {
        this.documentsStoreService.uploadDocuments(this.files);

        const message: Message = getToastContentBySeverity(ToastSeverity.Info);
        message.detail = this.ts.translate('fileUploadStarted');
        this.messageService.add(message);
      }
    });
  }

  removeFile(event: Event, fileUpload: FileUpload, index: number): void {
    fileUpload.remove(event, index);
    this.updateValidationStatus();
  }

  choose(fileUpload: FileUpload): void {
    fileUpload.choose();
  }

  onSelectedFiles(event: FileSelectEvent, _fileUpload: FileUpload) {
    this.files = event.currentFiles;

    this.updateValidationStatus();
  }

  private updateValidationStatus(): void {
    this.errorMapper.clear();
    this.totalSize = 0;
    this.files.forEach((file: File) => {
      this.totalSize += file.size;
      this.validateFile(file);
    });

    if (this.errorMapper.size === 0 && this.files.length > 0) {
      this.documentsStoreService.switchCanUploadData(true);
    } else {
      this.documentsStoreService.switchCanUploadData(false);
    }
  }

  private validateFile(file: File): void {
    const errorMessages = {
      wrongFileSize: this.ts.translate(this.errorMessages.wrongFileSize, {
        filename: file.name,
      }),
      wrongFileNameLength: this.ts.translate(
        this.errorMessages.wrongFileNameLength,
        { filename: file.name },
      ),
      wrongTotalFileSize: this.ts.translate(
        this.errorMessages.wrongTotalFileSize,
        { filename: file.name },
      ),
    };

    const errors = validateFileHelper(file, errorMessages, this.MAX_FILE_SIZE);

    if (errors.length > 0) {
      this.errorMapper.set(file.name, errors);
    }
  }
}
