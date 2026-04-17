import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';

import {
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
  
} from '@customer-portal/data-access/settings';
import {
  AppPagesEnum,
  modalBreakpoints,
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared';

import {
  AdminGridComponent,
  ManagePermissionsModalComponent,
  ManagePermissionsModalFooterComponent,
  ManagePermissionsModalHeaderComponent,
  MembersGridComponent,
} from '../settings-tabs-members';
import { NewMemberModalFooterComponent } from '../settings-tabs-members/new-member';
import { NewMemberModalComponent } from '../settings-tabs-members/new-member/new-member.component';
import { SettingsMembersStoreService } from '@customer-portal/data-access/settings/state/store-services';

@Component({
  selector: 'lib-co-browsing-members-select',
  imports: [
    AdminGridComponent,
    SharedButtonComponent,
    CommonModule,
    MembersGridComponent,
    TranslocoDirective,
    ButtonModule,
  ],
  providers: [DialogService, SettingsCompanyDetailsStoreService],

  templateUrl: './co-browsing-company-select.component.html',
  styleUrl: './co-browsing-company-select.component.scss',
})
export class CoBrowsingMembersSelectComponent implements OnInit {
  ref: DynamicDialogRef | undefined;
  sharedButtonType = SharedButtonType;

  constructor(
    public settingsCompanyDetailsStoreService: SettingsCompanyDetailsStoreService,
    public settingsMembersStoreService: SettingsMembersStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private dialogService: DialogService,
    private translocoService: TranslocoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.settingsCoBrowsingStoreService.isDnvUser()) {
      this.settingsCompanyDetailsStoreService.loadSettingsCompanyDetails();
      this.settingsMembersStoreService.loadMemberRoles();
    }
  }

  onGoBackClick(): void {
    this.router.navigate([AppPagesEnum.CoBrowsingCompanySelect]);
  }

  onAddMemberClick(): void {
    this.ref = this.dialogService.open(NewMemberModalComponent, {
      header: this.translocoService.translate('settings.membersTab.addMember'),
      width: '50vw',
      contentStyle: { overflow: 'auto', padding: '0' },
      breakpoints: modalBreakpoints,
      closable: true,
      data: {
        roles: this.settingsMembersStoreService.memberRoles(),
        formData: this.settingsMembersStoreService.newMemberForm(),
      },
      templates: {
        footer: NewMemberModalFooterComponent,
      },
    });

    this.ref.onClose.pipe(take(1)).subscribe((data: boolean) => {
      if (data) {
        this.settingsMembersStoreService.loadMembersPermissions();
        this.openMembersPermissionsModal();
      } else {
        this.settingsMembersStoreService.discardNewMemberFormInfo();
      }
    });
  }

  private openMembersPermissionsModal(): void {
    this.ref = this.dialogService.open(ManagePermissionsModalComponent, {
      width: '50vw',
      contentStyle: { overflow: 'auto', padding: '0' },
      breakpoints: modalBreakpoints,
      data: {
        showBackBtn: true,
      },
      templates: {
        footer: ManagePermissionsModalFooterComponent,
        header: ManagePermissionsModalHeaderComponent,
      },
    });

    this.ref.onClose.pipe(take(1)).subscribe((data: boolean) => {
      if (data) {
        this.settingsMembersStoreService.submitNewMemberInfo();
      } else {
        this.settingsMembersStoreService.discardMemberPermissionsUserSelection();
        this.onAddMemberClick();
      }
    });
  }
}
