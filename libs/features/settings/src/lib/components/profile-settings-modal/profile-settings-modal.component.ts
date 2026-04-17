import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
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
import { tap } from 'rxjs';

import {
  ProfileSettingsLanguagesModel,
  ProfileStoreService,
} from '@customer-portal/data-access/settings';

@Component({
  selector: 'lib-profile-settings-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoDirective,
    DropdownModule,
    InputTextModule,
  ],
  templateUrl: './profile-settings-modal.component.html',
  styleUrl: './profile-settings-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsModalComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  languages = signal<ProfileSettingsLanguagesModel[]>([]);
  selectedLanguage!: ProfileSettingsLanguagesModel | undefined;
  roles: { label: string; value: string }[] = [];

  constructor(
    private config: DynamicDialogConfig,
    private profileStoreService: ProfileStoreService,
    private destroyRef: DestroyRef,
    private fb: FormBuilder,
  ) {
    if (this.config.data) {
      this.languages.set(this.config.data.languages || []);
      this.selectedLanguage = this.languages().find((l) => l.isSelected);

      if (this.config.data.roles?.length) {
        this.roles = this.config.data.roles.map((role: string) => ({
          label: role,
          value: role,
        }));
      }
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    this.handleFormStateChanged();
  }

  ngOnDestroy(): void {
    this.profileStoreService.updateSubmitSettingsStatus(false);
  }

  initializeForm(): void {
    let selectedRole = null;
    const role = this.config.data.jobTitle;

    if (this.roles.length) {
      selectedRole = this.roles.find((r) => r.value === role);
    }

    this.form = this.fb.group({
      communicationLanguage: [this.selectedLanguage, [Validators.required]],
      jobTitle: [selectedRole?.value, [Validators.required]],
    });
  }

  handleFormStateChanged(): void {
    this.form.valueChanges
      .pipe(
        tap(() =>
          this.profileStoreService.updateSubmitSettingsStatus(this.form.valid),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.profileStoreService.updateSubmitSettingsStateValues(
          this.form.value,
        );
      });
  }
}
