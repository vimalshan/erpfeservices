import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';
import { combineLatest } from 'rxjs';

import {
  OverviewFilterTypes,
  OverviewListStoreService,
} from '@customer-portal/data-access/overview';
import { ProfileStoreService } from '@customer-portal/data-access/settings';
import { PagePermissionsService } from '@customer-portal/permissions';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import {
  SharedSelectMultipleModComponent,
  TreeDropdownComponent,
} from '@customer-portal/shared/components/select';
import { CustomTreeNode } from '@customer-portal/shared/models';
import { BreadcrumbService } from '@customer-portal/shared/services/breadcrumb';

@Component({
  selector: 'lib-overview-list-filters',
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedSelectMultipleModComponent,
    SharedButtonComponent,
    TreeDropdownComponent,
  ],
  templateUrl: './overview-list-filters.component.html',
  styleUrls: ['./overview-list-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewListFiltersComponent implements OnInit {
  overviewFilterType = OverviewFilterTypes;

  sharedButtonType = SharedButtonType;

  siteData: CustomTreeNode[] = [];
  latestExpandedState = new Map<string, boolean>();
  filterSites: number[] = [];
  globalSelectedIds = new Set<number>();

  protected destroyRef = inject(DestroyRef);

  constructor(
    public readonly overviewListStoreService: OverviewListStoreService,
    public readonly profileStoreService: ProfileStoreService,
    public readonly pagePermissionsService: PagePermissionsService,
    public readonly breadcrumbService: BreadcrumbService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.overviewListStoreService.loadOverviewListFilters();

    combineLatest([
      this.overviewListStoreService.dataSites$,
      this.overviewListStoreService.filterSites$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([dataSites, filterSites]) => {
        this.siteData = dataSites;
        this.filterSites = filterSites;
        this.cdr.markForCheck();
      });
  }

  onExpandedStateChange(map: Map<string, boolean>) {
    this.latestExpandedState = map;
  }

  onFilterChange(data: unknown, key: OverviewFilterTypes): void {
    this.overviewListStoreService.updateOverviewListFilterByKey(data, key);
  }

  onReset(): void {
    this.latestExpandedState = new Map();
    this.filterSites = [];
    this.globalSelectedIds.clear();

    this.overviewListStoreService.resetOverviewListFilterState();
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
      this.overviewFilterType.Sites,
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
}
