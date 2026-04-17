import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'shared-dialog',
  imports: [CommonModule, DialogModule],
  templateUrl: './custom-dialog.component.html',
  styleUrl: './custom-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDialogComponent {
  public header = input<string>();
  public visible = model<boolean>(false);
  public modal = input<boolean>(true);
  public closable = input<boolean>(true);
  public draggable = input<boolean>(false);
  public resizable = input<boolean>(false);
  public styleClass = input<string>();
  public width = input<string>();
  public maximizable = input<boolean>(false);

  public hideEvent = output<void>();

  onHide(): void {
    this.hideEvent.emit();
  }
}
