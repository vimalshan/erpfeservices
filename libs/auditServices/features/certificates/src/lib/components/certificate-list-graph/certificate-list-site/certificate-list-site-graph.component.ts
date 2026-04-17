import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TabViewModule } from 'primeng/tabview';

import { CertificateListGraphStoreService } from '@erp-services/data-access/certificates';
import { TreeTableComponent } from '@erp-services/shared/components/tree-table';

@Component({
  selector: 'lib-certificate-list-site-graph',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    TabViewModule,
    TreeTableComponent,
  ],
  templateUrl: './certificate-list-site-graph.component.html',
  styleUrls: ['./certificate-list-site-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CertificateListGraphStoreService],
})
export class CertificateListSiteGraphComponent {
  public scrollableColumns = computed(
    () =>
      this.certificateListGraphStoreService.certificateBySiteColumns()[
        'scrollableColumns'
      ],
  );
  public frozenColumns = computed(
    () =>
      this.certificateListGraphStoreService.certificateBySiteColumns()[
        'frozenColumns'
      ],
  );

  constructor(
    public readonly certificateListGraphStoreService: CertificateListGraphStoreService,
  ) {}
}
