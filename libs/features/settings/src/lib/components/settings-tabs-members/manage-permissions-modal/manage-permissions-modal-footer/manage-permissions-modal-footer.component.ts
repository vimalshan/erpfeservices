import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Signal,
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { SettingsMembersStoreService } from '@customer-portal/data-access/settings/state/store-services';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';

@Component({
  selector: 'lib-new-member-modal-footer',
  imports: [SharedButtonComponent, TranslocoDirective],
  templateUrl: './manage-permissions-modal-footer.component.html',
  styleUrl: './manage-permissions-modal-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagePermissionsModalFooterComponent {
  isAddMemberFormValid: Signal<boolean>;
  showBackBtn = true;
  sharedButtonType = SharedButtonType;
  isButtonDisabled = computed(
    () =>
      !this.settingsMembersStoreService.canMemberInfoBeSubmitted() ||
      this.settingsMembersStoreService.isEditManagePermissionsFormPristine(),
  );

  constructor(
    public settingsMembersStoreService: SettingsMembersStoreService,
    private ref: DynamicDialogRef,
    private confirmationService: ConfirmationService,
    private ts: TranslocoService,
    private config: DynamicDialogConfig,
  ) {
    this.isAddMemberFormValid =
      this.settingsMembersStoreService.isAddMemberFormValid;

    this.showBackBtn = this.config.data?.showBackBtn;
  }

  closeDialog(): void {
    if (this.settingsMembersStoreService.hasMemberPermissionsChanged()) {
      this.confirmationService.confirm({
        header: this.ts.translate('settings.discardDraftPopup.header'),
        message: this.ts.translate('settings.discardDraftPopup.message'),
        reject: () => {
          this.discardPermissions();
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
      this.discardPermissions();
    }
  }

  onSubmit(): void {
    this.ref.close(true);
  }

  discardPermissions(): void {
    this.ref.close(false);
  }
}
