import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, take } from 'rxjs';

import {
  BaseServiceNowParams,
  LoggingService,
  NotificationParms,
  ServiceNowCaseDetailsId,
  ServiceNowService,
  ServiceNowTable,
} from '@customer-portal/core';
import { NotificationModel } from '@customer-portal/data-access/notifications';
import { NotificationListStoreService } from '@customer-portal/data-access/notifications/state/store-services';
import {
  ProfileLanguageStoreService,
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import { GridComponent } from '@customer-portal/shared/components/grid';
import { HtmlDetailsFooterModalComponent } from '@customer-portal/shared/components/html-details-footer-modal';
import { HtmlDetailsModalComponent } from '@customer-portal/shared/components/html-details-modal';
import {
  FINDINGS_STATUS_STATES_MAP,
  modalBreakpoints,
  NOTIFICATION_HELP_SUPPORT,
} from '@customer-portal/shared/constants';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import {
  ColumnDefinition,
  GridConfig,
  GridRowAction,
  HelpClickedModal,
  ToastSeverity,
} from '@customer-portal/shared/models';

import { notificationsList } from '../../__mocks__';
import { NOTIFICATION_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-notification-list',
  imports: [
    CommonModule,
    GridComponent,
    ButtonModule,
    TranslocoDirective,
    TooltipModule,
  ],
  providers: [NotificationListStoreService],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationListComponent
  extends BasePreferencesComponent
  implements OnInit
{
  cols: ColumnDefinition[] = NOTIFICATION_LIST_COLUMNS;
  notificationsList = notificationsList;
  statusStatesMap = FINDINGS_STATUS_STATES_MAP;
  public list?: Observable<GridRowAction>;

  constructor(
    public notificationListStoreService: NotificationListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private dialogService: DialogService,
    private ts: TranslocoService,
    private serviceNowService: ServiceNowService,
    private messageService: MessageService,
    private loggingService: LoggingService,
    private profileLanguageStoreService: ProfileLanguageStoreService,
    private profileStoreService: ProfileStoreService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.notificationListStoreService.loadNotificationList();
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.notificationListStoreService.updateGridConfig(gridConfig);
  }

  onNotificationRowClick(inputData: { rowData: GridRowAction }): void {
    if (this.settingsCoBrowsingStoreService.isDnvUser()) {
      return;
    }
    const { id, entityId, entityType, snowLink } =
      inputData.rowData as NotificationModel;
    this.notificationListStoreService.markNotificationAsRead(id);

    this.dialogService
      .open(HtmlDetailsModalComponent, {
        header: inputData.rowData.title,
        modal: true,
        width: '600px',
        breakpoints: modalBreakpoints,
        data: {
          message: inputData.rowData.message,
          footerButtonLanguage: inputData.rowData.language,
        },
        templates: {
          footer: HtmlDetailsFooterModalComponent,
        },
      })
      .onClose.pipe(take(1))
      .subscribe((result) => {
        if (result) {
          if (this.isHelpAction(result)) {
            this.openNotificationServiceNowSupport();
          } else if (snowLink) {
            this.openNotificationServiceNowSupport(snowLink);
          } else {
            this.notificationListStoreService.navigateFromNotification(
              entityId,
              entityType,
            );
          }
        }
      });
  }

  private isHelpAction(value: HelpClickedModal | boolean): boolean {
    if (typeof value === 'boolean') {
      return false;
    }

    return value.action === NOTIFICATION_HELP_SUPPORT.NotificationHelp;
  }

  private openNotificationServiceNowSupport(snowLink?: string): void {
    try {
      if (snowLink) {
        const notificationParams: NotificationParms = {
          language: this.profileLanguageStoreService.languageLabel(),
          table: ServiceNowTable,
          id: ServiceNowCaseDetailsId,
          sys_id: snowLink,
        };
        this.serviceNowService.openNotificationItemSupport(notificationParams);
      } else {
        const helpParams: BaseServiceNowParams = {
          language: this.profileLanguageStoreService.languageLabel(),
          reportingCountry:
            this.profileStoreService.profileInformation().countryCode,
        };
        this.serviceNowService.openCatalogItemSupport(helpParams);
      }
    } catch (error) {
      const message = getToastContentBySeverity(ToastSeverity.Error);
      message.summary = this.ts.translate('serviceNow.error');
      this.messageService.add(message);
      this.loggingService.logException(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}
