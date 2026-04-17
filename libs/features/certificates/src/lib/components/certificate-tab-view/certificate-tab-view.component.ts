import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TabViewModule } from 'primeng/tabview';

import { CertificateDocumentsComponent } from '../certificate-documents';
import { CertificateSitesListComponent } from '../certificate-sites-list';

@Component({
  selector: 'lib-certificate-tab-view',
  imports: [
    CommonModule,
    TabViewModule,
    TranslocoDirective,
    CertificateSitesListComponent,
    CertificateDocumentsComponent,
  ],
  templateUrl: './certificate-tab-view.component.html',
  styleUrl: './certificate-tab-view.component.scss',
})
export class CertificateTabViewComponent {
  @Input() isOutstandingStatus = false;
}
