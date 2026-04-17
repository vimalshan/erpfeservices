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
  FindingChartFilterKey,
  FindingListGraphStoreService,
  FindingTabs,
} from '@customer-portal/data-access/findings';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { NoDataComponent } from '@customer-portal/shared/components/no-data';
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
import { CategoryStylesService } from '@customer-portal/shared/services';

@Component({
  selector: 'lib-finding-list-graph',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedSelectDateRangeModComponent,
    SharedSelectMultipleModComponent,
    TabViewModule,
    SharedButtonComponent,
    TreeDropdownComponent,
    RouterModule,
    NoDataComponent,
  ],
  templateUrl: './finding-list-graph.component.html',
  styleUrls: ['./finding-list-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FindingListGraphStoreService],
})
export class FindingListGraphComponent implements OnInit, OnDestroy {
  private readonly tabsMapping: FindingTabs[] = [
    FindingTabs.FindingStatus,
    FindingTabs.OpenFindings,
    FindingTabs.FindingsByClause,
    FindingTabs.FindingsBySite,
    FindingTabs.Trends,
  ];
  private previousTabIndex = 0;
  tabRoutes = [
    'finding-status',
    'open-findings',
    'findings-by-clause',
    'findings-by-site',
    'trends',
  ];

  readonly FindingTabs = FindingTabs;
  activeTab = FindingTabs.FindingStatus;
  chartFilterKey = FindingChartFilterKey;

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

  dateRangeIsDisabled = false;

  protected destroyRef = inject(DestroyRef);

  constructor(
    public readonly findingListGraphStoreService: FindingListGraphStoreService,
    private _ts: TranslocoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private categoryStylesService: CategoryStylesService,
  ) {}

  ngOnInit(): void {
    this.findingListGraphStoreService.loadFindingListAndGraphFilters();
    this.subscribeToSiteData();

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

  setActiveTabFromRoute() {
    const urlSegments = this.router.url.split('/');
    const currentRoute = urlSegments[urlSegments.length - 1];

    const idx = this.tabRoutes.indexOf(currentRoute);

    if (idx >= 0) {
      const prevTab = this.tabsMapping[this.previousTabIndex];
      this.activeTabIndex = idx;
      this.activeTab = this.tabsMapping[idx];
      this.findingListGraphStoreService.setActiveFindingListGraphTab(
        this.activeTab,
      );
      this.applyTabDateLogic(this.activeTab, prevTab);
      this.previousTabIndex = idx;
      this.cdr.markForCheck();
    }
  }

  onExpandedStateChange(map: Map<string, boolean>) {
    this.latestExpandedState = map;
  }

  onFilterChange(data: unknown, key: FindingChartFilterKey): void {
    this.findingListGraphStoreService.updateFindingListGraphFilterByKey(
      data,
      key,
    );
  }

  ngOnDestroy(): void {
    this.findingListGraphStoreService.resetFindingsListGraphState();
    this.categoryStylesService.cleanup('findings-by-site');
    this.categoryStylesService.cleanup('findings-by-clause');
  }

  onDateRangeChange(event: { range: Date[]; type: TimeRange }) {
    const { range, type } = event;

    if (!range || range.length === 0) {
      this.selectedTimeRange.set(type);
      this.customDateRange.set(null);

      this.selectedTimeRangeStatus.set(type);
      this.customDateRangeStatus.set(null);

      this.findingListGraphStoreService.updateFindingListGraphFilterByKey(
        null,
        FindingChartFilterKey.TimeRange,
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

    this.selectedTimeRangeStatus.set(type);
    this.customDateRangeStatus.set(
      type === TimeRange.Custom ? [start, end] : null,
    );

    this.findingListGraphStoreService.updateFindingListGraphFilterByKey(
      [start, end],
      FindingChartFilterKey.TimeRange,
    );
  }

  onReset(): void {
    this.latestExpandedState = new Map();
    this.filterSites = [];
    this.globalSelectedIds.clear();
    this.selectedTimeRange.set('');
    this.customDateRange.set(null);

    this.findingListGraphStoreService.resetFindingListGraphFiltersExceptDateToCurrentYear();

    if (this.tabsMapping[this.activeTabIndex] === FindingTabs.Trends) {
      this.findingListGraphStoreService.updateFindingListGraphFilterByKey(
        getTimeModRange(TimeRange.YearCustom5Years),
        FindingChartFilterKey.TimeRange,
      );
    } else {
      this.findingListGraphStoreService.updateFindingListGraphFilterByKey(
        null,
        FindingChartFilterKey.TimeRange,
      );
    }

    this.cdr.markForCheck();
  }

  onTabChange(event: TabViewChangeEvent): void {
    const route = this.tabRoutes[event.index];
    this.router.navigate([route], { relativeTo: this.route });
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
    this.onFilterChange({ filter: selectedSiteIds }, this.chartFilterKey.Sites);
  }

  private subscribeToSiteData(): void {
    combineLatest([
      this.findingListGraphStoreService.dataSites$,
      this.findingListGraphStoreService.filterSites$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([dataSites, filterSites]) => {
        this.siteData = dataSites;
        this.filterSites = filterSites;
        this.cdr.markForCheck();
      });
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

  private getAllDescendantNodeIds(node: CustomTreeNode): number[] {
    let ids = [node.data];

    if (node.children && node.children.length > 0) {
      ids = ids.concat(
        node.children.flatMap((child) => this.getAllDescendantNodeIds(child)),
      );
    }

    return ids;
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

  private applyTabDateLogic(tab: FindingTabs, prevTab?: FindingTabs) {
    if (tab === FindingTabs.Trends) {
      this.dateRangeIsDisabled = true;
      const [start, end] = getTimeModRange(TimeRange.YearCustom5Years);

      if (this.selectedTimeRange() !== '') {
        this.selectedTimeRange.set('');
        this.customDateRange.set(null);
      }

      this.findingListGraphStoreService.updateFindingListGraphFilterByKey(
        [start, end],
        FindingChartFilterKey.TimeRange,
      );
    } else if (tab === FindingTabs.OpenFindings) {
      this.dateRangeIsDisabled = true;
      this.findingListGraphStoreService.updateFindingListGraphFilterByKey(
        [null, null],
        FindingChartFilterKey.TimeRange,
      );
    } else if (
      prevTab === FindingTabs.Trends ||
      prevTab === FindingTabs.OpenFindings
    ) {
      this.dateRangeIsDisabled = false;
      const prevType = this.selectedTimeRangeStatus() || '';
      const prevCustom = this.customDateRangeStatus() || null;

      if (this.selectedTimeRange() !== prevType) {
        this.selectedTimeRange.set(prevType);
        this.customDateRange.set(prevCustom);
      }

      let range: Date[] | [] = [];

      if (prevType === TimeRange.Custom && prevCustom) {
        range = prevCustom;
      } else if (prevType !== '') {
        range = getTimeModRange(prevType as TimeRange);
      }

      this.findingListGraphStoreService.updateFindingListGraphFilterByKey(
        range,
        FindingChartFilterKey.TimeRange,
      );
    }
  }
}
