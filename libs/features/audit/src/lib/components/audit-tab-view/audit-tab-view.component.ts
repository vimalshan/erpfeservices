import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TabViewModule } from 'primeng/tabview';

import { AuditDocumentsComponent } from '../audit-documents/audit-documents.component';
import { AuditFindingListComponent } from '../audit-finding-list/audit-finding-list.component';
import { AuditSitesListComponent } from '../audit-sites-list/audit-sites-list.component';
import { AuditSubListComponent } from '../audit-sub-list/audit-sub-list.component';

@Component({
  selector: 'lib-audit-tab-view',
  imports: [
    CommonModule,
    TabViewModule,
    TranslocoDirective,
    AuditDocumentsComponent,
    AuditFindingListComponent,
    AuditSitesListComponent,
    AuditSubListComponent,
  ],
  templateUrl: './audit-tab-view.component.html',
  styleUrl: './audit-tab-view.component.scss',
})
export class AuditTabViewComponent {}
