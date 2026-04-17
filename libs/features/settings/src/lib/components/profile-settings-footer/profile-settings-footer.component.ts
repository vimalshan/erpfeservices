import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ProfileStoreService } from '@customer-portal/data-access/settings';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';

@Component({
  selector: 'lib-profile-settings-footer',
  imports: [SharedButtonComponent, TranslocoDirective],
  templateUrl: './profile-settings-footer.component.html',
  styleUrl: './profile-settings-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsFooterComponent {
  isSubmitSettingsStatusValid: Signal<boolean>;
  sharedButtonType = SharedButtonType;

  constructor(
    private ref: DynamicDialogRef,
    private profileStoreService: ProfileStoreService,
  ) {
    this.isSubmitSettingsStatusValid =
      this.profileStoreService.submitSettingsStatus;
  }

  closeDialog(data: boolean): void {
    this.ref.close(data);
  }

  onSubmit(): void {
    this.ref.close(true);
    this.profileStoreService.updateSubmitSettingsValues();
  }
}
