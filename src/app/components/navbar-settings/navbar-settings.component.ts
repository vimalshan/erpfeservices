import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { PopoverModule, Popover } from 'primeng/popover';

import {
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
  SettingsTab,
} from '@erp-services/data-access/settings';
import { environment } from '@erp-services/environments';
import { AppPagesEnum } from '@erp-services/shared/constants';
import { Language } from '@erp-services/shared/models';
import { AuthService } from '@erp-services/shared/services';

import { NavbarButtonComponent } from '../navbar-button';

@Component({
  selector: 'erp-services-navbar-settings',
  imports: [
    CommonModule,
    TranslocoDirective,
    PopoverModule,
    NavbarButtonComponent,
  ],
  templateUrl: './navbar-settings.component.html',
  styleUrl: './navbar-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarSettingsComponent {
  @ViewChild('settingsPopover') settingsPopover!: Popover;

  public isButtonSettingsActive = signal<boolean>(false);
  public isLanguagePickerVisible = false;
  public languages = signal([Language.English, Language.Italian]);
  public settingsTab = SettingsTab;
  public isSuaadhyaUser = this.settingsCoBrowsingStoreService.isSuaadhyaUser;

  constructor(
    private readonly authService: AuthService,
    private readonly profileLanguageStoreService: ProfileLanguageStoreService,
    private readonly settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
  ) {}

  onChangeLanguage(language: Language): void {
    this.translocoService.setActiveLang(language);

    if (!this.isSuaadhyaUser()) {
      this.profileLanguageStoreService.updateProfileLanguage(language);
    }
  }

  onChangeLanguagePickerVisibility(value: boolean): void {
    this.isLanguagePickerVisible = value;
  }

  onLogoutClick(event: MouseEvent): void {
    this.authService.logout().subscribe(() => {
      this.settingsPopover.hide();
      window.location.href = `${environment.federatedLogoutUrl}${environment.baseUrl}${AppPagesEnum.Logout}`;
    });
  }

  onNavigateTo(route: string, tab: string, event: MouseEvent): void {
    this.settingsPopover.hide();
    this.router.navigate([`/${route}`], { queryParams: { tab } });
  }

  onToggleButtonSettingsActive(value: boolean): void {
    this.isButtonSettingsActive.set(value);

    if (!value) {
      this.onChangeLanguagePickerVisibility(false);
    }
  }

  onTogglePopover(event: MouseEvent): void {
    this.settingsPopover?.toggle(event);
  }
}
