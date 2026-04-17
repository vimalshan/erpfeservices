import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { SettingsTabsComponent } from '../settings-tabs';

@Component({
  selector: 'lib-settings',
  imports: [CommonModule, TranslocoDirective, SettingsTabsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {}
