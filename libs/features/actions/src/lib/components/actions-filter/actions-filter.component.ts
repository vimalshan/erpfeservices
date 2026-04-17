import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { ActionFilterKey } from '@customer-portal/data-access/actions';
import { ActionsListStoreService } from '@customer-portal/data-access/actions/state';
import {
  SharedSelectMultipleComponent,
  SharedSelectTreeComponent,
} from '@customer-portal/shared/components/select';

@Component({
  selector: 'lib-actions-filter',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedSelectMultipleComponent,
    SharedSelectTreeComponent,
  ],
  providers: [ActionsListStoreService],
  templateUrl: './actions-filter.component.html',
  styleUrl: './actions-filter.component.scss',
})
export class ActionsFilterComponent implements OnInit, OnDestroy {
  public actionFilterType = ActionFilterKey;

  constructor(public actionsListStoreService: ActionsListStoreService) {}

  ngOnInit(): void {
    this.actionsListStoreService.loadActionsFilterList();
  }

  onFilterChange(data: unknown, key: ActionFilterKey): void {
    this.actionsListStoreService.updateActionFilterByKey(data, key);
  }

  ngOnDestroy(): void {
    this.actionsListStoreService.clearActionFilter();
  }
}
