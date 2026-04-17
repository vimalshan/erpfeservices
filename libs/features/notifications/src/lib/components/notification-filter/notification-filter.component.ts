import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { NotificationFilterKey } from '@customer-portal/data-access/notifications';
import { NotificationListStoreService } from '@customer-portal/data-access/notifications/state/store-services';
import {
  SharedSelectMultipleComponent,
  SharedSelectTreeComponent,
} from '@customer-portal/shared/components/select';

@Component({
  selector: 'lib-notification-filter',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedSelectMultipleComponent,
    SharedSelectTreeComponent,
  ],
  providers: [NotificationListStoreService],
  templateUrl: './notification-filter.component.html',
  styleUrl: './notification-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationFilterComponent implements OnInit, OnDestroy {
  public filterTypes = NotificationFilterKey;

  constructor(
    public notificationListStoreService: NotificationListStoreService,
  ) {}

  ngOnInit(): void {
    this.notificationListStoreService.loadNotificationFilterList();
  }

  onFilterChange(data: unknown, key: NotificationFilterKey): void {
    this.notificationListStoreService.updateNotificationFilterByKey(data, key);
  }

  ngOnDestroy(): void {
    this.notificationListStoreService.clearNotificationFilter();
  }
}
