import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';

import {
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
} from '@erp-services/data-access/settings';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@erp-services/shared/components/button';
import { Roles } from '@erp-services/shared/constants';
import {
  ADMIN_PERMISSION_CHECKER,
  HasAdminPermissionDirective,
} from '@erp-services/shared/directives/permissions';

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

  public isSuaadhyaUser = computed(() =>
    this.settingsCoBrowsingStoreService.isSuaadhyaUser(),
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
