import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { combineLatest, filter } from 'rxjs';

import {
  AuditChartFilterKey,
  AuditChartsTabs,
  AuditListGraphStoreService,
} from '@customer-portal/data-access/audit';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import {
  SharedSelectDateRangeModComponent,
  SharedSelectMultipleModComponent,
  TreeDropdownComponent,
} from '@customer-portal/shared/components/select';
import {
  getTimeModRange,
  toUtcRange,
} from '@customer-portal/shared/helpers/time';
import { CustomTreeNode, TimeRange } from '@customer-portal/shared/models';

@Component({
  selector: 'lib-audit-list-graph',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    RouterModule,
    SharedSelectDateRangeModComponent,
    SharedSelectMultipleModComponent,
    TabViewModule,
    SharedButtonComponent,
    TreeDropdownComponent,
  ],
  templateUrl: './audit-list-graph.component.html',
  styleUrls: ['./audit-list-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuditListGraphStoreService],
})
export class AuditListGraphComponent implements OnInit, OnDestroy {
  private readonly tabsMapping: AuditChartsTabs[] = [
    AuditChartsTabs.AuditStatus,
    AuditChartsTabs.AuditDays,
  ];
  tabRoutes = ['audit-status', 'audit-days'];

  readonly AuditChartsTabs = AuditChartsTabs;
  dateRangeIsDisabled = false;
  chartFilterType = AuditChartFilterKey;
  activeTab = AuditChartsTabs.AuditStatus;

  sharedButtonType = SharedButtonType;

  siteData: CustomTreeNode[] = [];
  latestExpandedState = new Map<string, boolean>();
  filterSites: number[] = [];
  globalSelectedIds = new Set<number>();

  selectedTimeRangeStatus = signal('');
  customDateRangeStatus = signal<Date[] | null>(null);
  selectedTimeRange = signal('');
  customDateRange = signal<Date[] | null>(null);
  activeTabIndex = 0;

  protected destroyRef = inject(DestroyRef);

  constructor(
    public readonly auditListGraphStoreService: AuditListGraphStoreService,
    private _ts: TranslocoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.auditListGraphStoreService.loadAuditListAndGraphFilters();
    combineLatest([
      this.auditListGraphStoreService.dataSites$,
      this.auditListGraphStoreService.filterSites$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([dataSites, filterSites]) => {
        this.siteData = dataSites;
        this.filterSites = filterSites;
        this.cdr.markForCheck();
      });

    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.setActiveTabFromRoute();
      });
    this.setActiveTabFromRoute();
  }

  onExpandedStateChange(map: Map<string, boolean>) {
    this.latestExpandedState = map;
  }

  onFilterChange(data: unknown, key: AuditChartFilterKey): void {
    this.auditListGraphStoreService.updateAuditListGraphFilterByKey(data, key);
  }

  ngOnDestroy(): void {
    this.auditListGraphStoreService.resetAuditsListGraphState();
  }

  onTabChange(event: TabViewChangeEvent): void {
    const route = this.tabRoutes[event.index];
    this.router.navigate([route], { relativeTo: this.route });
  }

  onDateRangeChange(event: { range: Date[]; type: TimeRange }) {
    const { range, type } = event;

    if (!range || range.length === 0) {
      this.selectedTimeRange.set(type);
      this.customDateRange.set(null);

      this.selectedTimeRangeStatus.set(type);
      this.customDateRangeStatus.set(null);

      this.auditListGraphStoreService.updateAuditListGraphFilterByKey(
        null,
        AuditChartFilterKey.TimeRange,
      );

      return;
    }

    let start: Date;
    let end: Date;

    if (type === TimeRange.Custom) {
      [start, end] = toUtcRange(range);
    } else {
      [start, end] = range;
    }

    this.selectedTimeRange.set(type);
    this.customDateRange.set(type === TimeRange.Custom ? [start, end] : null);

    if (this.tabsMapping[this.activeTabIndex] === AuditChartsTabs.AuditStatus) {
      this.selectedTimeRangeStatus.set(type);
      this.customDateRangeStatus.set(
        type === TimeRange.Custom ? [start, end] : null,
      );
    }
    this.auditListGraphStoreService.updateAuditListGraphFilterByKey(
      [start, end],
      AuditChartFilterKey.TimeRange,
    );
  }

  onReset(): void {
    this.latestExpandedState = new Map();
    this.filterSites = [];
    this.globalSelectedIds.clear();
    this.selectedTimeRange.set('');
    this.customDateRange.set(null);

    this.selectedTimeRangeStatus.set('');
    this.customDateRangeStatus.set(null);
    this.auditListGraphStoreService.resetAuditListGraphFiltersExceptDateToCurrentYear();

    if (this.tabsMapping[this.activeTabIndex] === AuditChartsTabs.AuditStatus) {
      this.auditListGraphStoreService.updateAuditListGraphFilterByKey(
        null,
        AuditChartFilterKey.TimeRange,
      );
    } else {
      this.auditListGraphStoreService.updateAuditListGraphFilterByKey(
        getTimeModRange(TimeRange.YearCurrent),
        AuditChartFilterKey.TimeRange,
      );
    }
    this.cdr.markForCheck();
  }

  onSelectionChange(event: {
    changedNode?: CustomTreeNode;
    checked?: boolean;
    selectAll?: boolean;
  }) {
    if (event.selectAll !== undefined) {
      this.handleSelectAll(event.selectAll);
    } else if (event.changedNode) {
      this.handleNodeSelection(event.changedNode, event.checked ?? false);
    }

    const selectedSiteIds = Array.from(this.globalSelectedIds);
    this.onFilterChange(
      { filter: selectedSiteIds },
      this.chartFilterType.Sites,
    );
  }

  private handleSelectAll(selectAll: boolean) {
    if (selectAll) {
      this.globalSelectedIds = new Set(this.getAllSiteIds(this.siteData));
    } else {
      this.globalSelectedIds.clear();
    }
  }

  private handleNodeSelection(node: CustomTreeNode, checked: boolean) {
    if (node.children && node.children.length > 0) {
      const descendantIds = this.getAllDescendantLeafIds(node);
      descendantIds.forEach((id) =>
        checked
          ? this.globalSelectedIds.add(id)
          : this.globalSelectedIds.delete(id),
      );
    } else {
      if (checked) {
        this.globalSelectedIds.add(node.data);
      }

      if (!checked) {
        this.globalSelectedIds.delete(node.data);
      }
    }
  }

  private getAllDescendantLeafIds(node: CustomTreeNode): number[] {
    if (!node.children || node.children.length === 0) {
      return [node.data];
    }

    return node.children.flatMap((child) =>
      this.getAllDescendantLeafIds(child),
    );
  }

  private getAllSiteIds(nodes: CustomTreeNode[]): number[] {
    return nodes.flatMap((node) => this.getAllDescendantLeafIds(node));
  }

  private setActiveTabFromRoute() {
    const urlSegments = this.router.url.split('/');
    const currentRoute = urlSegments[urlSegments.length - 1];
    const idx = this.tabRoutes.indexOf(currentRoute);

    if (idx >= 0) {
      this.activeTabIndex = idx;
      this.activeTab = this.tabsMapping[idx];
      this.auditListGraphStoreService.setActiveAuditsListGraphTab(
        this.activeTab,
      );
      this.applyTabDateLogic(this.activeTab);

      this.cdr.markForCheck();
    }
  }

  private applyTabDateLogic(tab: AuditChartsTabs) {
    if (tab === AuditChartsTabs.AuditDays) {
      this.dateRangeIsDisabled = true;
      this.selectedTimeRange.set('');
      this.customDateRange.set(null);
      this.auditListGraphStoreService.updateAuditListGraphFilterByKey(
        getTimeModRange(TimeRange.YearCurrent),
        AuditChartFilterKey.TimeRange,
      );
    } else {
      this.dateRangeIsDisabled = false;
      const prevType = this.selectedTimeRangeStatus() || '';
      const prevCustom = this.customDateRangeStatus() || null;
      this.selectedTimeRange.set(prevType);
      this.customDateRange.set(prevCustom);
      let range: Date[] | [] = [];

      if (prevType === TimeRange.Custom && prevCustom) {
        range = prevCustom;
      } else if (prevType !== '') {
        range = getTimeModRange(prevType as TimeRange);
      }

      this.auditListGraphStoreService.updateAuditListGraphFilterByKey(
        range,
        AuditChartFilterKey.TimeRange,
      );
    }
  }
}
