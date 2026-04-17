import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Signal,
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import {
  CompanySettingsParams,
  LoggingService,
  ServiceNowService,
} from '@erp-services/core';
import {
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsData,
  SettingsCompanyDetailsStoreService,
} from '@erp-services/data-access/settings';
import { getToastContentBySeverity } from '@erp-services/shared/helpers/custom-toast';
import { ToastSeverity } from '@erp-services/shared/models';

 import { AddressEntity } from '../../constants/settings-tabs-company-details.model';

@Component({
  selector: 'lib-settings-tab-company-details-info',
  imports: [CommonModule, TranslocoDirective, ButtonModule, TooltipModule],
  templateUrl: './settings-tabs-company-details-info.component.html',
  styleUrl: './settings-tabs-company-details-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabsCompanyDetailsInfoComponent {
  public data = input.required<SettingsCompanyDetailsData>();
  public hasAccordion = input<boolean>(false);
  public isOrganizationNameVisible = input<boolean>(false);
  public isUserAdmin = input<boolean>(false);
  public isUpdatePendingParentCompany = input<boolean>(false);
  public isUpdatePendingLegalEntity = input<boolean>(false);
  public title = input<string>();
  public isLegalEntity = input<boolean>(false);
  public isButtonDisabled = computed(
    () =>
      this.isUpdatePendingParentCompany() ||
      (this.isLegalEntity() && this.isUpdatePendingLegalEntity()),
  );

  public isAccordionOpen = false;
  public isSuaadhyaUser: Signal<boolean>;

  constructor(
    private profileLanguageStoreService: ProfileLanguageStoreService,
    private settingsStoreService: SettingsCompanyDetailsStoreService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private serviceNowService: ServiceNowService,
    private messageService: MessageService,
    private loggingService: LoggingService,
    private readonly ts: TranslocoService,
  ) {
    this.isSuaadhyaUser = this.settingsCoBrowsingStoreService.isSuaadhyaUser;
  }

  onAccordionToggle(): void {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  openServiceNowCompanySettingsSupport(): void {
    try {
      const currentEntity = this.settingsStoreService
        .legalEntityList()
        .find((entity) => entity.accountId === this.data()?.accountId);
      const companySettingsParams: CompanySettingsParams = {
        language: this.profileLanguageStoreService.languageLabel(),
        accountSuaadhyaId: currentEntity?.accountSuaadhyaId ?? 0,
        accountName: currentEntity?.organizationName ?? '',
        reportingCountry: currentEntity?.countryCode ?? '',
        accountAddress: this.formatAddress(currentEntity),
      };
      this.serviceNowService.openCompanySettingsSupport(companySettingsParams);
    } catch (error) {
      const message = getToastContentBySeverity(ToastSeverity.Error);
      message.summary = this.ts.translate('serviceNow.error');
      this.messageService.add(message);
      this.loggingService.logException(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  private formatAddress(entity: AddressEntity | null | undefined): string {
    if (!entity) return '';

    const addressFields = [
      entity.address,
      entity.city,
      entity.zipcode,
      entity.country,
    ];

    return addressFields
      .filter((field) => field?.trim())
      .map((field) => field!.trim())
      .join(', ');
  }
}
