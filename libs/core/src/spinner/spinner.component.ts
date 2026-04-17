import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { CurrentRouteService } from '../route';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'lib-spinner',
  imports: [CommonModule, ProgressSpinnerModule, TranslocoDirective],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  constructor(
    public spinnerService: SpinnerService,
    private currentRouteService: CurrentRouteService,
  ) {}

  get isLoadingForCurrentRoute(): boolean {
    return this.spinnerService.isLoadingForRoute(
      this.currentRouteService.getRouteKey() ?? 'default',
    );
  }
}
