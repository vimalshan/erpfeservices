import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { NotificationFilterComponent } from '../notification-filter/notification-filter.component';

@Component({
  selector: 'lib-notifications',
  imports: [
    CommonModule,
    RouterModule,
    NotificationFilterComponent,
    TranslocoDirective,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {}
