import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { CustomCardComponent } from '@customer-portal/shared/components/custom-card';

import { EXTERNAL_APPS, ExternalAppModel } from '../../constants';

@Component({
  selector: 'lib-external-apps',
  imports: [CommonModule, CustomCardComponent, TranslocoModule],
  templateUrl: './external-apps.component.html',
  styleUrl: './external-apps.component.scss',
})
export class ExternalAppsComponent {
  externalApps = this.getApps();

  private getApps(): ExternalAppModel[] {
    return EXTERNAL_APPS;
  }
}
