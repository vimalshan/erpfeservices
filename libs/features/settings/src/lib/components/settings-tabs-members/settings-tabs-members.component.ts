import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';

import {
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
} from '@customer-portal/data-access/settings';
import { SettingsMembersStoreService } from '@customer-portal/data-access/settings/state/store-services';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { modalBreakpoints } from '@customer-portal/shared/constants';

import { AdminGridComponent } from './admin-grid/admin-grid.component';
import { MembersGridComponent } from './members-grid/members-grid.component';
import { NewMemberModalComponent } from './new-member/new-member.component';
import {
  ManagePermissionsModalComponent,
  ManagePermissionsModalFooterComponent,
  ManagePermissionsModalHeaderComponent,
} from './manage-permissions-modal';
import { NewMemberModalFooterComponent } from './new-member';

@Component({
  selector: 'lib-settings-tab-members',
  imports: [
    AdminGridComponent,
    SharedButtonComponent,
    CommonModule,
    TranslocoDirective,
    MembersGridComponent,
  ],
  providers: [DialogService, SettingsCompanyDetailsStoreService],
  templateUrl: './settings-tabs-members.component.html',
  styleUrl: './settings-tabs-members.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabsMembersComponent {
  ref: DynamicDialogRef | undefined;
  sharedButtonType = SharedButtonType;

  constructor(
    public settingsCompanyDetailsStoreService: SettingsCompanyDetailsStoreService,
    public settingsMembersStoreService: SettingsMembersStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private dialogService: DialogService,
    private translocoService: TranslocoService,
  ) {
    this.settingsCompanyDetailsStoreService.loadSettingsCompanyDetails();
    this.settingsMembersStoreService.loadMemberRoles();
  }

  onAddMemberClick(): void {
    this.dialogService
      .open(NewMemberModalComponent, {
        header: this.translocoService.translate(
          'settings.membersTab.addMember',
        ),
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
      })
      .onClose.pipe(take(1))
      .subscribe((data: boolean) => {
        if (data) {
          this.settingsMembersStoreService.loadMembersPermissions();
          this.openMembersPermissionsModal();
        } else {
          this.settingsMembersStoreService.discardNewMemberFormInfo();
        }
      });
  }

  private openMembersPermissionsModal(): void {
    this.dialogService
      .open(ManagePermissionsModalComponent, {
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
      })
      .onClose.pipe(take(1))
      .subscribe((data: boolean) => {
        if (data) {
          this.settingsMembersStoreService.submitNewMemberInfo();
        } else {
          this.settingsMembersStoreService.discardMemberPermissionsUserSelection();
          this.onAddMemberClick();
        }
      });
  }
}
