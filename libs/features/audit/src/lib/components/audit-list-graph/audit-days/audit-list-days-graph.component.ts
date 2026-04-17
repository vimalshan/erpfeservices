import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import {
  AuditChartFilterKey,
  AuditDaysNode,
  AuditListGraphStoreService,
} from '@customer-portal/data-access/audit';
import { ChartComponent } from '@customer-portal/shared/components/chart';
import { TreeTableComponent } from '@customer-portal/shared/components/tree-table';
import { chartTotalPlugin } from '@customer-portal/shared/helpers/chart';
import { getMonthStartEnd } from '@customer-portal/shared/helpers/date';
import { formatFilter } from '@customer-portal/shared/helpers/grid';
import {
  FilterValue,
  IndividualFilter,
  TreeColumnDefinition,
} from '@customer-portal/shared/models';
import {
  ChartFilter,
  ChartTypeEnum,
} from '@customer-portal/shared/models/chart';

import {
  AUDIT_DAYS_BAR_GRAPH_OPTIONS,
  AUDIT_STATUS_DOUGHNUT_GRAPH_OPTIONS,
} from '../../../constants';

@Component({
  selector: 'lib-audit-list-days-graph',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    ChartComponent,
    TreeTableComponent,
  ],
  templateUrl: './audit-list-days-graph.component.html',
  styleUrls: ['./audit-list-days-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditListDaysGraphComponent {
  chartFilterType = AuditChartFilterKey;

  barType = ChartTypeEnum.Bar;
  doughnutTotalPlugin = [chartTotalPlugin('doughnutLabel')];
  doughnutType = ChartTypeEnum.Doughnut;

  chartType = ChartTypeEnum;

  auditDaysBarOptions = AUDIT_DAYS_BAR_GRAPH_OPTIONS;
  auditDaysDoughnutOptions = AUDIT_STATUS_DOUGHNUT_GRAPH_OPTIONS;

  auditDoughnutFilter: ChartFilter = { bodyFilter: 'service' };
  auditDaysBarFilter: ChartFilter = {
    titleFilter: 'type',
    bodyFilter: 'service',
  };

  graphColumns: TreeColumnDefinition[] = [
    {
      field: 'location',
      header: 'location',
      isTranslatable: true,
      hasNavigationEnabled: true,
      width: '80%',
    },
    {
      field: 'auditDays',
      header: this._ts.translate(
        'audit.auditGraphs.auditDays.bySite.auditDays',
      ),
      isTranslatable: false,
      width: '20%',
    },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private _ts: TranslocoService,
    public readonly auditListGraphStoreService: AuditListGraphStoreService,
  ) {}

  onChartClick(_event: any): void {}

  onTooltipDaysButtonClick(
    event: FilterValue[],
    chartType: ChartTypeEnum,
  ): void {
    let filterValues = event;

    if (chartType === ChartTypeEnum.Bar) {
      filterValues = this.extractDateFiltersBasedOnMonth(event);
    }

    this.auditListGraphStoreService.navigateFromAuditListChartToListView(
      filterValues,
    );
  }

  onRowClicked(rowData: AuditDaysNode): void {
    const filterValue: IndividualFilter = {
      label: rowData.dataType,
      value: rowData.location,
    };
    this.auditListGraphStoreService.navigateFromAuditListChartTreeToListView(
      filterValue,
    );
  }

  private extractDateFiltersBasedOnMonth(event: FilterValue[]): FilterValue[] {
    const month = event[1]?.value?.[0]?.value || '';
    const { startDate, endDate } = getMonthStartEnd(month);

    const transformedEvent = [...event];
    [transformedEvent[1]] = formatFilter([startDate, endDate], 'startDate');

    return transformedEvent;
  }
}
