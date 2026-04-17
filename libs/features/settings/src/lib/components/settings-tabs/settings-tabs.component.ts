import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';
import { map, Observable } from 'rxjs';

import { SettingsTab } from '@customer-portal/data-access/settings';
import { RouteStoreService } from '@customer-portal/router';

import { SettingsTabsCompanyDetailsComponent } from '../settings-tabs-company-details';
import { SettingsTabsMembersComponent } from '../settings-tabs-members';
import { SettingsTabsPersonalInformationComponent } from '../settings-tabs-personal-information';

@Component({
  selector: 'lib-settings-tabs',
  imports: [
    CommonModule,
    RouterModule,
    TabViewModule,
    TranslocoDirective,
    SettingsTabsCompanyDetailsComponent,
    SettingsTabsMembersComponent,
    SettingsTabsPersonalInformationComponent,
  ],
  templateUrl: './settings-tabs.component.html',
  styleUrl: './settings-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabsComponent {
  private readonly settingsTabMapping: SettingsTab[] = [
    SettingsTab.PersonalInformation,
    SettingsTab.CompanyDetails,
    SettingsTab.Members,
  ];

  tabIndex$: Observable<number>;

  public tabIndex = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly routeStoreService: RouteStoreService,
  ) {
    this.tabIndex$ = this.routeStoreService.getQueryParamByKey('tab').pipe(
      map((tab: string | null) => {
        if (!tab) return 0;
        const index = this.settingsTabMapping.indexOf(tab as SettingsTab);

        return index !== -1 ? index : 0;
      }),
    );
  }

  onTabChange(event: TabViewChangeEvent): void {
    const queryParams: Params = {
      tab: this.settingsTabMapping[event.index],
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
