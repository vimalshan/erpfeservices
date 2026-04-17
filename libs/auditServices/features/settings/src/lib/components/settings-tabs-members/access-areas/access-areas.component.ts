import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { CheckboxModule } from 'primeng/checkbox';

import { AccessAreas } from '../../../models';

enum PermissionAreas {
  View = 'view',
  Edit = 'edit',
  Submit = 'submit',
}

@Component({
  selector: 'lib-access-areas',
  imports: [
    CommonModule,
    CheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    TranslocoDirective,
  ],
  templateUrl: './access-areas.component.html',
  styleUrl: './access-areas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessAreasComponent {
  isAdminRightsChecked = input<boolean>(false);
  areas = input<AccessAreas[]>([]);
  changeAccessAreas = output<AccessAreas[]>();

  permissionAreas = PermissionAreas;

  onChangeAccessAreas(i: number, areaType: string): void {
    const allAreas = [...this.areas()];
    const selectedArea = allAreas[i];
    const { edit, view, submit } = selectedArea.permission;

    if (areaType === this.permissionAreas.View && view !== undefined) {
      view.isChecked = !view.isChecked;
    }

    if (areaType === this.permissionAreas.Edit && edit !== undefined) {
      edit.isChecked = !edit.isChecked;

      if (view !== undefined) {
        view.isChecked = edit.isChecked;
      }
    }

    if (areaType === this.permissionAreas.Submit && submit !== undefined) {
      submit.isChecked = !submit.isChecked;

      if (view !== undefined) {
        view.isChecked = submit.isChecked;
      }

      if (edit !== undefined) {
        edit.isChecked = submit.isChecked;
      }
    }

    selectedArea.permission = { edit, view, submit };
    allAreas[i] = selectedArea;

    this.changeAccessAreas.emit(allAreas);
  }
}
