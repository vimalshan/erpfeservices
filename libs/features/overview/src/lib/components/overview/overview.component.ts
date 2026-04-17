import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { OverviewStoreService } from '@customer-portal/data-access/overview';
import { ProfileStoreService } from '@customer-portal/data-access/settings';
import {
  PagePermissionsService,
  PermissionCategories,
  PermissionsList,
} from '@customer-portal/permissions';
import {
  BreadcrumbService,
  CardNavigationPayload,
  SharedButtonComponent,
  SharedButtonType,
  SharedCustomDynamicCardComponent,
} from '@customer-portal/shared';

import { OverviewFiltersComponent } from '../overview-filters';
import { OverviewFinancialStatusComponent } from '../overview-financial-status/overview-financial-status.component';
import { OverviewTrainingStatusComponent } from '../overview-training-status/overview-training-status.component';
import { OverviewUpcomingAuditsComponent } from '../overview-upcoming-audits/overview-upcoming-audits.component';

@Component({
  selector: 'lib-overview',
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedCustomDynamicCardComponent,
    SharedButtonComponent,
    OverviewFiltersComponent,
    OverviewUpcomingAuditsComponent,
    OverviewFinancialStatusComponent,
    OverviewTrainingStatusComponent,
    FormsModule,
  ],
  providers: [OverviewStoreService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit, OnDestroy {
  permissionCategories = PermissionCategories;
  permissionsList = PermissionsList;
  sharedButtonType = SharedButtonType;

  userFirstName = computed(() =>
    this.profileStoreService.profileInformation().firstName
      ? `, ${this.profileStoreService.profileInformation().firstName}`
      : '',
  );

  constructor(
    public readonly profileStoreService: ProfileStoreService,
    public readonly pagePermissionsService: PagePermissionsService,
    public readonly overviewStoreService: OverviewStoreService,
    public readonly breadcrumbService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.overviewStoreService.loadOverviewCardData();
    this.breadcrumbService.setBreadcrumbVisibility(true);
  }

  ngOnDestroy(): void {
    this.overviewStoreService.resetOverviewCardData();
    this.breadcrumbService.setBreadcrumbVisibility(false);
  }

  onRequestMoreServiceCards(): void {
    this.overviewStoreService.loadMoreOverviewCardData();
  }

  onCardClicked(payload: CardNavigationPayload): void {
    this.overviewStoreService.navigateFromOverviewCardToListView(payload);
  }
}
