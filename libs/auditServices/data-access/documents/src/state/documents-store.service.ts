import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { DocType } from '../models';
import { BaseFileUploadErrors } from '../models/documents.model';
import { DocumentsSelectors } from '../selectors/documents.selectors';
import {
  DeleteDocument,
  DownloadAllDocuments,
  DownloadDocument,
  LoadUploadDocumentsInfo,
  SwitchCanUploadData,
  UploadDocuments,
} from './documents.actions';

@Injectable({ providedIn: 'root' })
export class DocumentsStoreService {
  get canUploadData(): Signal<boolean> {
    return this.store.selectSignal(DocumentsSelectors.canUploadData);
  }

  constructor(private store: Store) {}

  @Dispatch()
  switchCanUploadData = (canUploadData: boolean) =>
    new SwitchCanUploadData(canUploadData);

  @Dispatch()
  loadUploadDocumentsInfo = (
    uploadUrl: string,
    fileUploadErrors: BaseFileUploadErrors,
    fileUploadSuccess: string,
    auditId?: string,
  ) =>
    new LoadUploadDocumentsInfo(
      uploadUrl,
      fileUploadErrors,
      fileUploadSuccess,
      auditId,
    );

  @Dispatch()
  uploadDocuments = (files: File[]) => new UploadDocuments(files);

  @Dispatch()
  downloadDocument = (documentId: number, fileName?: string) =>
    new DownloadDocument(documentId, fileName);

  @Dispatch()
  downloadAllDocuments = (documentsIds: number[], docType: DocType) =>
    new DownloadAllDocuments(documentsIds, docType);

  deleteDocument = (
    serviceName: string,
    serviceId: string,
    documentId: number,
  ) =>
    this.store.dispatch(new DeleteDocument(serviceName, serviceId, documentId));
}
