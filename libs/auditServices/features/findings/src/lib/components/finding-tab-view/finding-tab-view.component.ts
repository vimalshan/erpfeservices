import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TabViewModule } from 'primeng/tabview';

import { FindingDocumentsComponent } from '../finding-documents/finding-documents.component';
import { FindingManageContentComponent } from '../finding-manage-content/finding-manage-content.component';
import { FindingPreviousResponsesComponent } from '../finding-previous-responses/finding-previous-responses.component';

@Component({
  selector: 'lib-finding-tab-view',
  imports: [
    CommonModule,
    TabViewModule,
    TranslocoDirective,
    FindingDocumentsComponent,
    FindingManageContentComponent,
    FindingPreviousResponsesComponent,
  ],
  templateUrl: './finding-tab-view.component.html',
  styleUrl: './finding-tab-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingTabViewComponent {
  @Input()
  isResponseHistoryAvailable = false;
}
