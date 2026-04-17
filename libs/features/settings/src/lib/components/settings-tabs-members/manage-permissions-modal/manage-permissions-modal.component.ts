import { CommonModule } from '@angular/common';
import { Component, computed, effect, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

import { SettingsMembersStoreService } from '@customer-portal/data-access/settings/state/store-services';
import { SharedSelectTreeComponent } from '@customer-portal/shared/components/select';
import { SharedSelectTreeChangeEventOutput } from '@customer-portal/shared/models';

import { AccessAreas } from '../../../models';
import { AccessAreasComponent } from '../access-areas/access-areas.component';
import { AdminRightsComponent } from '../admin-rights/admin-rights.component';

enum AreaTranslations {
  contracts = 'settings.form.members.contracts',
  schedules = 'settings.form.members.schedules',
  audits = 'settings.form.members.audits',
  findings = 'settings.form.members.findings',
  certificates = 'settings.form.members.certificates',
  financials = 'settings.form.members.financials',
}

enum DropdownType {
  Company = 'Company',
  Service = 'Service',
  Site = 'Site',
}

@Component({
  selector: 'lib-manage-permissions-modal',
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    TranslocoDirective,
    SharedSelectTreeComponent,
    AdminRightsComponent,
    AccessAreasComponent,
  ],
  templateUrl: './manage-permissions-modal.component.html',
  styleUrl: './manage-permissions-modal.component.scss',
})
export class ManagePermissionsModalComponent implements OnDestroy {
  DropdownType = DropdownType;
  permissionsAreas: AccessAreas[] = [];
  isInEditMode = false;
  displayName = computed(() => {
    const newMember = this.settingsMembersStoreService.newMemberForm();
    const selectedUser = this.settingsMembersStoreService.selectedUserDetails();

    if (newMember?.firstName && newMember?.lastName) {
      return `${newMember.firstName} ${newMember.lastName}`;
    }

    if (selectedUser) {
      const { firstName = '', lastName = '' } = selectedUser;

      return `${firstName} ${lastName}`.trim();
    }

    return '';
  });
  displayEmail = computed(
    () =>
      this.settingsMembersStoreService.newMemberForm()?.email ||
      this.settingsMembersStoreService.selectedUserDetails()?.email,
  );

  constructor(
    public settingsMembersStoreService: SettingsMembersStoreService,
    public config: DynamicDialogConfig,
  ) {
    const { memberEmail = '', isAdmin } = config.data ?? {};

    if (isAdmin !== undefined && !isAdmin) {
      this.settingsMembersStoreService.changeReceivedAdminPermissions(false);
    }

    if (memberEmail) {
      this.isInEditMode = true;
      this.settingsMembersStoreService.loadUserDetailsToManagePermission(
        memberEmail,
      );
    } else {
      this.settingsMembersStoreService.changeEditManagePermissionsPristineForm(
        false,
      );
    }

    effect(() => {
      this.permissionsAreas = this.settingsMembersStoreService
        .memberAreasPermissions()
        .map((item) => ({
          ...item,
          name: AreaTranslations[item.area as keyof typeof AreaTranslations],
        }));
    });
  }

  ngOnDestroy(): void {
    this.settingsMembersStoreService.changeEditManagePermissionsPristineForm(
      true,
    );
  }

  onComapaniesChange(event: SharedSelectTreeChangeEventOutput): void {
    this.settingsMembersStoreService.saveMemberPermissionsCompanies(
      event.filter,
    );
    this.userChangedInfo();
  }

  onServicesChange(event: SharedSelectTreeChangeEventOutput): void {
    this.settingsMembersStoreService.saveMemberPermissionsServices(
      event.filter,
    );
    this.userChangedInfo();
  }

  onSitesChange(event: SharedSelectTreeChangeEventOutput): void {
    this.settingsMembersStoreService.saveMemberPermissionsSites(
      event.filter as any,
    );
    this.userChangedInfo();
  }

  onChangeAdminRights(event: boolean): void {
    this.settingsMembersStoreService.changeReceivedAdminPermissions(event);
    this.userChangedInfo();
  }

  onChangeAccessAreas(areas: AccessAreas[]): void {
    this.settingsMembersStoreService.updateMemberAreasPermissions(
      areas.map(({ name: _name, ...rest }) => rest),
    );
    this.userChangedInfo();
  }

  private userChangedInfo(): void {
    if (this.isInEditMode) {
      this.settingsMembersStoreService.changeEditManagePermissionsPristineForm(
        false,
      );
    }
  }
}
