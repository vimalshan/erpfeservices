import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
  WritableSignal,
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'primeng/accordion';

import { FindingDetailsStoreService } from '@customer-portal/data-access/findings';

@Component({
  selector: 'lib-finding-responses-accordion',
  imports: [CommonModule, TranslocoDirective, AccordionModule],
  templateUrl: './finding-responses-accordion.component.html',
  styleUrl: './finding-responses-accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingResponsesAccordionComponent {
  private selectedTabsIndex: WritableSignal<number[]> = signal([]);

  constructor(
    private ts: TranslocoService,
    public findingDetailsStoreService: FindingDetailsStoreService,
  ) {
    effect(() => {
      this.findingDetailsStoreService.responseHistory();
      this.resetTabsIndexes();
    });
  }

  onSelectedChange(isSelected: boolean, i: number): void {
    if (isSelected) {
      this.selectedTabsIndex.update((indexes) => [...indexes, i]);
    } else {
      this.selectedTabsIndex.update((indexes) =>
        indexes.filter((index) => index !== i),
      );
    }
  }

  tabHeader(i: number): string {
    return this.selectedTabsIndex().includes(i)
      ? this.ts.translate('findings.responseHistory.hideResponse')
      : this.ts.translate('findings.responseHistory.viewResponse');
  }

  private resetTabsIndexes() {
    this.selectedTabsIndex.set([]);
  }
}
