import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { SharedPageToggleComponent } from '@customer-portal/shared/components/page-toggle';
import { SharedButtonToggleDatum } from '@customer-portal/shared/components/toggle';

@Component({
  selector: 'lib-schedule',
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    SharedPageToggleComponent,
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  public pageToggleOptions: Partial<SharedButtonToggleDatum<string>>[] = [
    {
      i18nKey: 'buttons.toggle.calendar',
      icon: 'calendar',
      label: 'Calendar',
      value: './',
    },
    {
      i18nKey: 'buttons.toggle.lists',
      icon: 'list',
      label: 'Lists',
      value: 'list',
    },
  ];
}
