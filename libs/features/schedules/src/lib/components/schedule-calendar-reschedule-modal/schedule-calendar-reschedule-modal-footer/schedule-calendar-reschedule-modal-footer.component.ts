import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';

import {
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
} from '@customer-portal/data-access/settings';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { Roles } from '@customer-portal/shared/constants';
import {
  ADMIN_PERMISSION_CHECKER,
  HasAdminPermissionDirective,
} from '@customer-portal/shared/directives/permissions';

import { SCHEDULE_LIST_SUPPORT } from '../../../constants';
import { RequestChangesModel } from '../../../models';

@Component({
  selector: 'lib-schedule-calendar-reschedule-modal-footer',
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedButtonComponent,
    HasAdminPermissionDirective,
  ],
  providers: [
    {
      provide: ADMIN_PERMISSION_CHECKER,
      useExisting: SettingsCompanyDetailsStoreService,
    },
  ],
  templateUrl: './schedule-calendar-reschedule-modal-footer.component.html',
  styleUrl: './schedule-calendar-reschedule-modal-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleCalendarRescheduleModalFooterComponent {
  isFormValid: Observable<boolean>;
  sharedButtonType = SharedButtonType;
  public roles = Roles;

  public isDnvUser = computed(() =>
    this.settingsCoBrowsingStoreService.isDnvUser(),
  );

  constructor(
    private readonly config: DynamicDialogConfig,
    private readonly ref: DynamicDialogRef,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
  ) {
    this.isFormValid = this.config.data.formValid.asObservable();
  }

  onCancel(): void {
    this.ref.close(false);
  }

  onSubmit(): void {
    this.ref.close(true);
  }

  onRequestChanges(): void {
    const requestChanges: RequestChangesModel = {
      action: SCHEDULE_LIST_SUPPORT.RequestChanges,
      id: this.config.data.id,
    };
    this.ref.close(requestChanges);
  }
}
