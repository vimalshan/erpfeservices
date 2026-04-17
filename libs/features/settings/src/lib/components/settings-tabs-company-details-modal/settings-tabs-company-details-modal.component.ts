import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { tap } from 'rxjs';

import {
  SettingsCompanyDetailsData,
  SettingsCompanyDetailsStoreService,
} from '@customer-portal/data-access/settings';

@Component({
  selector: 'lib-settings-tab-company-details-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoDirective,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    RadioButtonModule,
    TooltipModule,
  ],
  templateUrl: './settings-tabs-company-details-modal.component.html',
  styleUrl: './settings-tabs-company-details-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabsCompanyDetailsModalComponent implements OnInit {
  public formPatch = input<SettingsCompanyDetailsData>();

  public form!: FormGroup;

  constructor(
    public readonly settingsStoreService: SettingsCompanyDetailsStoreService,
    private readonly fb: FormBuilder,
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.setFormGroup(this.formPatch() || this.config?.data?.formPatch);
    this.setRefObs();
    this.handleFormChanges();
  }

  setRefObs(): void {
    this.ref.onClose.subscribe((isSubmitted: boolean) => {
      if (isSubmitted) {
        this.onSubmit();
      }
    });
  }

  setFormGroup(patch: Partial<SettingsCompanyDetailsData> = {}): void {
    this.form = this.getFormGroup();
    this.form.patchValue(patch);
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  getFormGroup(): FormGroup {
    return this.fb.group({
      accountId: [''],
      address: [''],
      city: [''],
      countryId: new FormControl<string>('', [Validators.required]),
      organizationName: new FormControl<string>('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      poNumberRequired: [false],
      vatNumber: [null],
      zipcode: [null],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.settingsStoreService.updateSettingsCompanyDetails(this.form.value);
    }
  }

  private handleFormChanges(): void {
    this.form.valueChanges
      .pipe(
        tap(() => {
          this.settingsStoreService.updateEditCompanyDetailsFormValidity(
            this.form.valid,
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
