import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
} from '@angular/core';
import { filter, tap } from 'rxjs';

import {
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
} from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import { GridComponent } from '@customer-portal/shared/components/grid';
import {
  ObjectName,
  ObjectType,
  PageName,
} from '@customer-portal/shared/constants';
import { ColumnDefinition, GridConfig } from '@customer-portal/shared/models';

import { SETTINGS_TABS_COMPANY_DETAILS_GRID_COLUMNS } from '../../constants';
import { SettingsTabsCompanyDetailsInfoComponent } from '../settings-tabs-company-details-info';

@Component({
  selector: 'lib-settings-tab-company-details-grid',
  imports: [
    CommonModule,
    GridComponent,
    SettingsTabsCompanyDetailsInfoComponent,
  ],
  templateUrl: './settings-tabs-company-details-grid.component.html',
  styleUrl: './settings-tabs-company-details-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabsCompanyDetailsGridComponent
  extends BasePreferencesComponent
  implements OnDestroy
{
  public isUserAdmin = input<boolean>(false);
  public isLegalEntity = input<boolean>(false);

  public cols: ColumnDefinition[] = SETTINGS_TABS_COMPANY_DETAILS_GRID_COLUMNS;
  public isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.settingsStoreService.loadSettingsCompanyDetails();
    }),
  );

  constructor(
    public readonly settingsStoreService: SettingsCompanyDetailsStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
  ) {
    super();

    this.initializePreferences(
      PageName.SettingsCompanyDetails,
      ObjectName.CompanyDetails,
      ObjectType.Grid,
    );
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.settingsStoreService.updateSettingsCompanyDetailsEntityListGridConfig(
      gridConfig,
    );
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }

  ngOnDestroy(): void {
    this.settingsStoreService.resetSettingsCompanyDetailsState();
  }
}
