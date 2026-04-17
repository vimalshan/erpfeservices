import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ProfileStoreService } from '@customer-portal/data-access/settings';

@Component({
  selector: 'lib-certificate-suspension-message-modal',
  imports: [CommonModule, TranslocoDirective],
  templateUrl: './certificate-suspension-message-modal.component.html',
  styleUrl: './certificate-suspension-message-modal.component.scss',
})
export class CertificateSuspensionMessageModalComponent {
  constructor(
    public profileStoreService: ProfileStoreService,
    public config: DynamicDialogConfig,
  ) {}
}
