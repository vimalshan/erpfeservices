import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { SharedPageToggleComponent } from '@customer-portal/shared/components/page-toggle';
import { SharedButtonToggleDatum } from '@customer-portal/shared/components/toggle';

@Component({
  selector: 'lib-finding',
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    SharedPageToggleComponent,
  ],
  templateUrl: './finding.component.html',
  styleUrl: './finding.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingComponent {
  public pageToggleOptions: Partial<SharedButtonToggleDatum<string>>[] = [
    {
      i18nKey: 'buttons.toggle.lists',
      icon: 'list',
      label: 'Lists',
      value: './',
    },
    {
      i18nKey: 'buttons.toggle.graphs',
      icon: 'chart-pie',
      label: 'Graphs',
      value: 'listgraphs',
    },
  ];
}
