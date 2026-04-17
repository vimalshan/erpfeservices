import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { BadgeModule } from 'primeng/badge';

export type BadgeSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast';

@Component({
  selector: 'shared-badge',
  imports: [CommonModule, BadgeModule],
  templateUrl: './custom-badge.component.html',
  styleUrl: './custom-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomBadgeComponent {
  public value = input<string | number>();
  public severity = input<BadgeSeverity>('primary');
  public size = input<'large' | 'xlarge'>();
  public badgeClass = input<string>();
}
