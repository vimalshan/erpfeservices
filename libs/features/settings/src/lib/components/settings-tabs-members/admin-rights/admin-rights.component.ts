import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'lib-admin-rights',
  imports: [CommonModule, CheckboxModule, FormsModule, TranslocoDirective],
  templateUrl: './admin-rights.component.html',
  styleUrl: './admin-rights.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRightsComponent {
  adminRightsChange = output<boolean>();

  isChecked = input<boolean>(false);

  onChangeAdminRights(event: CheckboxChangeEvent): void {
    this.adminRightsChange.emit(event.checked);
  }
}
