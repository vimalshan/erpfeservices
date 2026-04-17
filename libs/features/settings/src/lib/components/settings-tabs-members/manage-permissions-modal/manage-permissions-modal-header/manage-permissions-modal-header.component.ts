import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { SettingsMembersStoreService } from '@customer-portal/data-access/settings/state/store-services';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';

@Component({
  selector: 'lib-member-permissions-modal-header',
  imports: [SharedButtonComponent, TranslocoDirective],
  templateUrl: './manage-permissions-modal-header.component.html',
  styleUrl: './manage-permissions-modal-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagePermissionsModalHeaderComponent {
  public sharedButtonType = SharedButtonType;

  constructor(
    private settingsMembersStoreService: SettingsMembersStoreService,
    private ref: DynamicDialogRef,
    private confirmationService: ConfirmationService,
    private ts: TranslocoService,
  ) {}

  onClick(): void {
    if (this.settingsMembersStoreService.hasMemberPermissionsChanged()) {
      this.confirmationService.confirm({
        header: this.ts.translate('settings.discardDraftPopup.header'),
        message: this.ts.translate('settings.discardDraftPopup.message'),
        reject: () => {
          this.ref.close(false);
        },
        acceptLabel: this.ts.translate(
          'settings.discardDraftPopup.continueEditing',
        ),
        rejectLabel: this.ts.translate('settings.discardDraftPopup.discard'),
        acceptIcon: 'null',
        rejectIcon: 'null',
        acceptButtonStyleClass: 'accept-button',
        rejectButtonStyleClass: 'reject-button',
      });
    } else {
      this.ref.close();
    }
  }
}
