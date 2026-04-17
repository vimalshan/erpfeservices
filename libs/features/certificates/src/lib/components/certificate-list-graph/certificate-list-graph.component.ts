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
import { combineLatest } from 'rxjs';

import {
  CertificateChartFilterKey,
  CertificateListGraphStoreService,
  CertificatesTabs,
} from '@customer-portal/data-access/certificates';
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
  ChartTypeEnum,
  CustomTreeNode,
  TimeRange,
} from '@customer-portal/shared/models';

@Component({
  selector: 'lib-certificate-list-graph',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    RouterModule,
    SharedSelectMultipleModComponent,
    TabViewModule,
    SharedButtonComponent,
    TreeDropdownComponent,
    SharedSelectDateRangeModComponent,
  ],
  templateUrl: './certificate-list-graph.component.html',
  styleUrls: ['./certificate-list-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CertificateListGraphStoreService],
})
export class CertificateListGraphComponent implements OnInit, OnDestroy {
  private readonly tabsMapping: CertificatesTabs[] = [
    CertificatesTabs.CertificatesStatus,
    CertificatesTabs.CertificatesBySite,
  ];
  tabRoutes = ['status', 'site'];

  chartFilterType = CertificateChartFilterKey;
  timeRange = TimeRange;

  readonly CertificatesTabs = CertificatesTabs;
  activeTab = CertificatesTabs.CertificatesStatus;
  activeTabIndex = 0;

  chartType = ChartTypeEnum;

  sharedButtonType = SharedButtonType;

  siteData: CustomTreeNode[] = [];
  latestExpandedState = new Map<string, boolean>();
  filterSites: number[] = [];
  globalSelectedIds = new Set<number>();

  selectedTimeRange = signal('');
  customDateRange = signal<Date[] | null>(null);

  protected destroyRef = inject(DestroyRef);

  constructor(
    public readonly certificateListGraphStoreService: CertificateListGraphStoreService,
    private _ts: TranslocoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.certificateListGraphStoreService.loadCertificateListAndGraphFilters();
    combineLatest([
      this.certificateListGraphStoreService.dataSites$,
      this.certificateListGraphStoreService.filterSites$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([dataSites, filterSites]) => {
        this.siteData = dataSites;
        this.filterSites = filterSites;
        this.cdr.markForCheck();
      });

    this.router.events
      .pipe((source) => source, takeUntilDestroyed(this.destroyRef))
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this.setActiveTabFromRoute();
        }
      });
    this.setActiveTabFromRoute();
  }

  onExpandedStateChange(map: Map<string, boolean>) {
    this.latestExpandedState = map;
  }

  onFilterChange(data: unknown, key: CertificateChartFilterKey): void {
    this.certificateListGraphStoreService.updateCertificateListGraphFilterByKey(
      data,
      key,
    );
  }

  ngOnDestroy(): void {
    this.certificateListGraphStoreService.resetCertificateListGraphState();
  }

  onTabChange(event: TabViewChangeEvent): void {
    const route = this.tabRoutes[event.index];
    this.router.navigate([route], { relativeTo: this.route });
  }

  onReset(): void {
    this.latestExpandedState = new Map();
    this.filterSites = [];
    this.globalSelectedIds.clear();

    this.certificateListGraphStoreService.resetCertificateListGraphFiltersExceptDateToCurrentYear();
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

  private setActiveTabFromRoute() {
    const urlSegments = this.router.url.split('/');
    const currentRoute = urlSegments[urlSegments.length - 1];
    const idx = this.tabRoutes.indexOf(currentRoute);

    if (idx >= 0) {
      this.activeTabIndex = idx;
      this.activeTab = this.tabsMapping[idx];
      this.certificateListGraphStoreService.setActiveCertificatesListGraphTab(
        this.activeTab,
      );
      this.certificateListGraphStoreService.updateCertificateListGraphFilterByKey(
        null,
        CertificateChartFilterKey.TimeRange,
      );
      this.cdr.markForCheck();
    }
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
}
