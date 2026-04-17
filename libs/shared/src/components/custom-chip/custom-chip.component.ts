import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'shared-chip',
  imports: [CommonModule, ChipModule],
  templateUrl: './custom-chip.component.html',
  styleUrl: './custom-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomChipComponent {
  public label = input<string>();
  public icon = input<string>();
  public image = input<string>();
  public removable = input<boolean>(false);
  public chipClass = input<string>();

  public removeEvent = output<Event>();

  onRemove(event: Event): void {
    this.removeEvent.emit(event);
  }
}
