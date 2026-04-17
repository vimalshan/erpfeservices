import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { take } from 'rxjs';

import {
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import { environment } from '@customer-portal/environments';
import { modalBreakpoints } from '@customer-portal/shared';

import { ProfileSettingsFooterComponent } from '../profile-settings-footer';
import { ProfileSettingsModalComponent } from '../profile-settings-modal';

@Component({
  selector: 'lib-settings-tab-personal-information',
  imports: [CommonModule, TranslocoDirective, ButtonModule, TooltipModule],
  providers: [DialogService],
  templateUrl: './settings-tabs-personal-information.component.html',
  styleUrl: './settings-tabs-personal-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabsPersonalInformationComponent {
  ref: DynamicDialogRef | undefined;
  isDnvUser: Signal<boolean>;

  constructor(
    public profileStoreService: ProfileStoreService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private dialogService: DialogService,
    private ts: TranslocoService,
  ) {
    this.profileStoreService.loadProfileData();
    this.profileStoreService.loadUserRoles();
    this.isDnvUser = this.settingsCoBrowsingStoreService.isDnvUser;
  }

  onClickEditSettings(): void {
    this.dialogService
      .open(ProfileSettingsModalComponent, {
        header: this.ts.translate('settings.form.profile.settingsModal.header'),
        width: '50vw',
        contentStyle: { overflow: 'auto', padding: '0' },
        breakpoints: modalBreakpoints,
        data: {
          languages: this.profileStoreService.profileInformation().languages,
          roles: this.profileStoreService.userRoles(),
          jobTitle: this.profileStoreService.profileInformation().jobTitle,
        },
        templates: {
          footer: ProfileSettingsFooterComponent,
        },
      })
      .onClose.pipe(take(1))
      .subscribe((result) => {
        // to do: Add handler
      });
  }

  onEditVeracityClick(pageName: string): void {
    const { veracityUrl } = environment;
    const navigationUrl = `${veracityUrl}${pageName}`;
    window.open(navigationUrl, '_blank');
  }
}
