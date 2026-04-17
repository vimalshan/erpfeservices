import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, EMPTY, tap } from 'rxjs';

import { SettingsMembersStoreService } from '@customer-portal/data-access/settings/state/store-services';

import { enhancedEmailValidator } from '../../../helpers';

@Component({
  selector: 'lib-new-member',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoDirective,
    DropdownModule,
    InputTextModule,
    TooltipModule,
  ],
  templateUrl: './new-member.component.html',
  styleUrl: './new-member.component.scss',
})
export class NewMemberModalComponent implements OnInit {
  form!: FormGroup;
  roles: { label: string; value: string }[] = [];

  constructor(
    private config: DynamicDialogConfig,
    private destroyRef: DestroyRef,
    private fb: FormBuilder,
    private settingsMembersStoreService: SettingsMembersStoreService,
  ) {
    if (this.config.data && this.config.data.roles?.length) {
      this.roles = this.config.data.roles.map((role: string) => ({
        label: role,
        value: role,
      }));
    }
  }

  ngOnInit(): void {
    this.form = this.initializeForm();
    this.handleFormChanges();
  }

  private initializeForm(): FormGroup {
    const { formData } = this.config.data;

    const {
      firstName = '',
      lastName = '',
      email = '',
      role = '',
    } = formData || {};

    let selectedRole = null;

    if (role && this.roles.length) {
      selectedRole = this.roles.find((r) => r.value === role);
    }

    return this.fb.group({
      firstName: [firstName, [Validators.required]],
      lastName: [lastName, [Validators.required]],
      email: [
        email,
        [Validators.required, Validators.email, enhancedEmailValidator()],
      ],
      role: [selectedRole, [Validators.required]],
    });
  }

  private handleFormChanges(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => {
          this.settingsMembersStoreService.switchContinueToPermissionsStatus(
            this.form.valid,
          );

          if (this.form.valid) {
            const { firstName, lastName, email, role } =
              this.form.getRawValue();

            this.settingsMembersStoreService.updateNewMemberForm({
              firstName,
              lastName,
              email,
              role: role.value,
            });
          }

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
