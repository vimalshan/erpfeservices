import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { SettingsCompanyDetailsStoreService } from '@customer-portal/data-access/settings';

import { SettingsTabsCompanyDetailsGridComponent } from '../settings-tabs-company-details-grid';
import { SettingsTabsCompanyDetailsInfoComponent } from '../settings-tabs-company-details-info';

@Component({
  selector: 'lib-settings-tab-company-details',
  imports: [
    CommonModule,
    TranslocoDirective,
    SettingsTabsCompanyDetailsGridComponent,
    SettingsTabsCompanyDetailsInfoComponent,
  ],
  providers: [SettingsCompanyDetailsStoreService],
  templateUrl: './settings-tabs-company-details.component.html',
  styleUrl: './settings-tabs-company-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabsCompanyDetailsComponent implements OnInit {
  constructor(
    public readonly settingsStoreService: SettingsCompanyDetailsStoreService,
  ) {}

  ngOnInit(): void {
    this.settingsStoreService.loadSettingsCompanyDetails();
    this.settingsStoreService.loadSettingsCompanyDetailsCountryList();
  }
}
