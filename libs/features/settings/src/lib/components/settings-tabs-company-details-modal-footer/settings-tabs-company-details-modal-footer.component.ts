import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { SettingsCompanyDetailsStoreService } from '@customer-portal/data-access/settings';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared';

@Component({
  selector: 'lib-settings-tab-company-details-modal-footer',
  imports: [CommonModule, SharedButtonComponent, TranslocoDirective],
  templateUrl: './settings-tabs-company-details-modal-footer.component.html',
  styleUrl: './settings-tabs-company-details-modal-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabsCompanyDetailsModalFooterComponent {
  isFormValid: Signal<boolean>;
  sharedButtonType = SharedButtonType;

  constructor(
    private readonly ref: DynamicDialogRef,
    private settingsStoreService: SettingsCompanyDetailsStoreService,
  ) {
    this.isFormValid = this.settingsStoreService.isEditCompanyDetailsFormValid;
  }

  onCloseEditSettings(): void {
    this.ref.close();
  }

  onSubmit(): void {
    const isFormValid =
      this.settingsStoreService.isEditCompanyDetailsFormValid();

    if (isFormValid) {
      this.ref.close();
    }
  }
}
