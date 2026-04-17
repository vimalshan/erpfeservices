import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { DropdownModule } from 'primeng/dropdown';

import {
  CoBrowsingCompany,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import { environment } from '@customer-portal/environments';
import {
  AppPagesEnum,
  AuthService,
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared';

@Component({
  selector: 'lib-co-browsing-company-select',
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    SharedButtonComponent,
    TranslocoDirective,
  ],
  providers: [],
  templateUrl: './co-browsing-members-select.component.html',
  styleUrl: './co-browsing-members-select.component.scss',
})
export class CoBrowsingCompanySelectComponent implements OnInit {
  sharedButtonType = SharedButtonType;

  constructor(
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    if (this.settingsCoBrowsingStoreService.isDnvUser()) {
      this.settingsCoBrowsingStoreService.getCompanyList();
    }
  }

  ngOnInit(): void {
    this.settingsCoBrowsingStoreService.resetSelectedCobrowsingCompany();
  }

  onContinueClick(): void {
    if (this.settingsCoBrowsingStoreService.selectedCoBrowsingCompany()) {
      this.router.navigate([AppPagesEnum.CoBrowsingMembersSelect]);
    }
  }

  onCompanyChange(event: CoBrowsingCompany): void {
    this.settingsCoBrowsingStoreService.updateSelectedCoBrowsingCompany(event);
  }

  onLogout(): void {
    this.authService.logout().subscribe(() => {
      window.location.href = `${environment.federatedLogoutUrl}${environment.baseUrl}${AppPagesEnum.Logout}`;
    });
  }
}
