import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { SettingsCompanyDetailsStoreService } from '@customer-portal/data-access/settings';
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
  selector: 'lib-schedule-calendar-confirm-modal-footer',
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
  templateUrl: './schedule-calendar-confirm-modal-footer.component.html',
  styleUrl: './schedule-calendar-confirm-modal-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleCalendarConfirmModalFooterComponent {
  public sharedButtonType = SharedButtonType;
  public roles = Roles;

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
  ) {}

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
