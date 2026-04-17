import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { OverviewListStoreService } from '@erp-services/data-access/overview';
import { ProfileStoreService } from '@erp-services/data-access/settings';
import {
  PagePermissionsService,
  PermissionCategories,
  PermissionsList,
} from '@erp-services/permissions';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@erp-services/shared/components/button';
import { SharedCustomDynamicCardComponent } from '@erp-services/shared/components/custom-dynamic-card';
import { NoDataComponent } from '@erp-services/shared/components/no-data';
import { CardNavigationPayload } from '@erp-services/shared/models/card';
import { BreadcrumbService } from '@erp-services/shared/services/breadcrumb';

import { OverviewFinancialStatusComponent } from '../overview-financial-status';
import { OverviewTrainingStatusComponent } from '../overview-training-status';
import { OverviewUpcomingAuditsComponent } from '../overview-upcoming-audits';
import { OverviewListFiltersComponent } from './overview-list-filters';

@Component({
  selector: 'lib-overview-list',
  imports: [
    CommonModule,
    TranslocoDirective,
    OverviewUpcomingAuditsComponent,
    OverviewFinancialStatusComponent,
    OverviewTrainingStatusComponent,
    FormsModule,
    SharedButtonComponent,
    SharedCustomDynamicCardComponent,
    OverviewListFiltersComponent,
    NoDataComponent,
  ],
  providers: [OverviewListStoreService],
  templateUrl: './overview-list.component.html',
  styleUrls: ['./overview-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewListComponent implements OnInit, OnDestroy {
  permissionCategories = PermissionCategories;
  permissionsList = PermissionsList;

  sharedButtonType = SharedButtonType;

  userFirstName = computed(() =>
    this.profileStoreService.profileInformation().firstName
      ? `, ${this.profileStoreService.profileInformation().firstName}`
      : '',
  );

  protected destroyRef = inject(DestroyRef);

  constructor(
    public readonly profileStoreService: ProfileStoreService,
    public readonly pagePermissionsService: PagePermissionsService,
    public readonly breadcrumbService: BreadcrumbService,
    public readonly overviewListStoreService: OverviewListStoreService,
  ) {}

  ngOnInit(): void {
    this.overviewListStoreService.loadOverviewListCardData();
    this.breadcrumbService.setBreadcrumbVisibility(true);
  }

  ngOnDestroy(): void {
    this.overviewListStoreService.resetOverviewListState();
    this.breadcrumbService.setBreadcrumbVisibility(false);
  }

  onRequestMoreServiceCards(): void {
    this.overviewListStoreService.loadMoreOverviewListCardData();
  }

  onCardClicked(payload: CardNavigationPayload): void {
    this.overviewListStoreService.navigateFromOverviewListCardToListView(
      payload,
    );
  }
}
