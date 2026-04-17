import { Component, Signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { DocumentsStoreService } from '@erp-services/data-access/documents/state';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@erp-services/shared/components/button';

@Component({
  selector: 'lib-add-documents-footer',
  imports: [SharedButtonComponent, TranslocoDirective],
  templateUrl: './add-documents-footer.component.html',
  styleUrls: ['./add-documents-footer.component.scss'],
})
export class AddDocumentsFooterComponent {
  canUploadData: Signal<boolean>;
  sharedButtonType = SharedButtonType;

  constructor(
    private ref: DynamicDialogRef,
    private documentsStoreService: DocumentsStoreService,
  ) {
    this.canUploadData = this.documentsStoreService.canUploadData;
  }

  closeDialog(data: boolean): void {
    this.ref.close(data);
  }
}
