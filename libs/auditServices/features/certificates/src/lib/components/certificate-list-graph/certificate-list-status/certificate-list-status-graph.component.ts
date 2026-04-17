import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TabViewModule } from 'primeng/tabview';

import {
  CertificateChartFilterKey,
  CertificateListGraphStoreService,
  CertificatesTabs,
} from '@erp-services/data-access/certificates';
import { ChartComponent } from '@erp-services/shared/components/chart';
import { chartTotalPlugin } from '@erp-services/shared/helpers/chart';
import {
  ChartFilter,
  ChartTypeEnum,
} from '@erp-services/shared/models/chart';

import {
  CERTIFICATES_BY_STATUS_GRAPH_OPTIONS,
  CERTIFICATES_BY_TYPE_GRAPH_OPTIONS,
} from '../../../constants';

@Component({
  selector: 'lib-certificate-list-status-graph',
  standalone: true,
  imports: [CommonModule, TranslocoDirective, TabViewModule, ChartComponent],
  templateUrl: './certificate-list-status-graph.component.html',
  styleUrls: ['./certificate-list-status-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CertificateListGraphStoreService],
})
export class CertificateListStatusGraphComponent {
  chartFilterType = CertificateChartFilterKey;

  readonly CertificatesTabs = CertificatesTabs;
  activeTab = CertificatesTabs.CertificatesStatus;

  chartType = ChartTypeEnum;

  certificatesByStatusChartOptions = CERTIFICATES_BY_STATUS_GRAPH_OPTIONS;
  certificatesByTypeChartOptions = CERTIFICATES_BY_TYPE_GRAPH_OPTIONS;
  barType = ChartTypeEnum.Bar;
  doughnutTotalPlugin = [chartTotalPlugin('doughnutLabel')];
  doughnutType = ChartTypeEnum.Doughnut;
  certificatesByStatusChartFilters: ChartFilter = {
    bodyFilter: 'status',
  };
  certificatesByTypeChartFilters: ChartFilter = {
    titleFilter: 'service',
    bodyFilter: 'status',
  };

  constructor(
    public readonly certificateListGraphStoreService: CertificateListGraphStoreService,
  ) {}
}
