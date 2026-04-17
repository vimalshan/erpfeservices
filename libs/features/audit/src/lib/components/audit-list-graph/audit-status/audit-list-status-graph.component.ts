import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { AuditListGraphStoreService } from '@customer-portal/data-access/audit';
import { ChartComponent } from '@customer-portal/shared/components/chart';
import { chartTotalPlugin } from '@customer-portal/shared/helpers/chart';
import {
  ChartFilter,
  ChartTypeEnum,
} from '@customer-portal/shared/models/chart';
import { FilterValue } from '@customer-portal/shared/models/grid';

import {
  AUDIT_STATUS_BAR_GRAPH_OPTIONS,
  AUDIT_STATUS_DOUGHNUT_GRAPH_OPTIONS,
} from '../../../constants';

@Component({
  selector: 'lib-audit-list-status-graph',
  standalone: true,
  imports: [CommonModule, TranslocoDirective, ChartComponent],
  templateUrl: './audit-list-status-graph.component.html',
  styleUrls: ['./audit-list-status-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditListStatusGraphComponent {
  auditStatusDoughnutGraphOptions = AUDIT_STATUS_DOUGHNUT_GRAPH_OPTIONS;
  auditStatusBarGraphOptions = AUDIT_STATUS_BAR_GRAPH_OPTIONS;
  barType = ChartTypeEnum.Bar;
  doughnutTotalPlugin = [chartTotalPlugin('doughnutLabel')];
  doughnutType = ChartTypeEnum.Doughnut;
  auditStatusDoughnutChartFilters: ChartFilter = { bodyFilter: 'status' };
  auditStatusBarChartFilters: ChartFilter = {
    titleFilter: 'type',
    bodyFilter: 'status',
  };

  chartType = ChartTypeEnum;

  constructor(
    public readonly auditListGraphStoreService: AuditListGraphStoreService,
    private _ts: TranslocoService,
    private cdr: ChangeDetectorRef,
  ) {}

  onChartClick(_event: any): void {}

  onTooltipButtonClick(event: FilterValue[]): void {
    this.auditListGraphStoreService.navigateFromAuditListChartToListView(event);
  }
}
