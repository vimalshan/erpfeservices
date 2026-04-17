import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'shared-divider',
  imports: [CommonModule, DividerModule],
  templateUrl: './custom-divider.component.html',
  styleUrl: './custom-divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDividerComponent {
  public layout = input<'horizontal' | 'vertical'>('horizontal');
  public type = input<'solid' | 'dashed' | 'dotted'>('solid');
  public align = input<'left' | 'center' | 'right' | 'top' | 'bottom'>();
  public styleClass = input<string>();
}
