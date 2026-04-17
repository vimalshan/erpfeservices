import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { FindingHistoryResponseModel } from '@customer-portal/data-access/findings';

import { FindingResponsesAccordionComponent } from '../finding-responses-accordion/finding-responses-accordion.component';

@Component({
  selector: 'lib-finding-previous-responses',
  imports: [
    CommonModule,
    TranslocoDirective,
    FindingResponsesAccordionComponent,
  ],
  templateUrl: './finding-previous-responses.component.html',
  styleUrl: './finding-previous-responses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingPreviousResponsesComponent {
  @Input() responseHistory: FindingHistoryResponseModel[] | undefined;
}
