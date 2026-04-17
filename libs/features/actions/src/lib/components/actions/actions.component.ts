import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ActionsFilterComponent } from '../actions-filter/actions-filter.component';

@Component({
  selector: 'lib-actions',
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    ActionsFilterComponent,
  ],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
})
export class ActionsComponent {
  public preferenceData = {
    filters: {
      categories: [],
      sites: [],
      services: [],
      companies: [],
    },
  };
}
