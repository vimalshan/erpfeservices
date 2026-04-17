import { HttpResponse } from '@angular/common/http';

import { FileUpload } from '@customer-portal/shared';

import { DocType } from '../models';
import { BaseFileUploadErrors } from '../models/documents.model';

export class DownloadDocument {
  static readonly type = '[Documents] Download Document';

  constructor(
    public documentId: number,
    public fileName?: string,
  ) {}
}

export class DownloadDocumentSuccess {
  static readonly type = '[Documents] Download Document Success';

  constructor(public blob: HttpResponse<Blob>) {}
}

export class DownloadDocumentFail {
  static readonly type = '[Documents] Download Document Fail';
}

export class DeleteDocument {
  static readonly type = '[Documents] Delete Document';

  constructor(
    public serviceName: string,
    public serviceId: string,
    public documentId: number,
  ) {}
}

export class DeleteDocumentSuccesfully {
  static readonly type = '[Documents] Delete Documents Succesfully';
}

export class DeleteDocumentWithError {
  static readonly type = '[Documents] Delete Document With Error';
}

export class SwitchCanUploadData {
  static readonly type = '[Documents] Switch Can Upload Data Flag';

  constructor(public canUploadData: boolean) {}
}

export class LoadUploadDocumentsInfo {
  static readonly type = '[Documents] Load Upload Documents Info';

  constructor(
    public uploadUrl: string,
    public fileUploadErrors: BaseFileUploadErrors,
    public fileUploadSuccess: string,
    public auditId?: string,
  ) {}
}

export class UploadDocuments {
  static readonly type = '[Documents] Upload Documents';

  constructor(public files: File[]) {}
}

export class ShowNotificationAfterUploadDocumentSuccess {
  static readonly type =
    '[Documents] Show Notification After Upload Document Success';

  constructor(
    public uploadStatus: FileUpload,
    public fileUploadSuccess: string,
  ) {}
}

export class ShowNotificationAfterUploadDocumentFail {
  static readonly type =
    '[Documents] Show Notification After Upload Document Fail';

  constructor(
    public uploadStatus: FileUpload,
    public fileUploadErrors: BaseFileUploadErrors,
  ) {}
}

export class UploadDocumentsSuccess {
  static readonly type = '[Documents] Upload Documents Success';
}

export class DownloadAllDocuments {
  static readonly type = '[Documents] Download All Documents';

  constructor(
    public documentsIds: number[],
    public docType: DocType,
  ) {}
}

export class DownloadAllDocumentsSuccess {
  static readonly type = '[Documents] Download All Documents Success';

  constructor(public blob: HttpResponse<Blob>) {}
}

export class DownloadAllDocumentsFail {
  static readonly type = '[Documents] Download All Documents Fail';
}
