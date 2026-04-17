import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { distinctUntilChanged, map, tap } from 'rxjs';

import {
  FindingDetailsModel,
  FindingResponsesFormModel,
  FindingResponsesModel,
} from '@erp-services/data-access/findings';
import {
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
} from '@erp-services/data-access/settings';
import {
  PermissionCategories,
  PermissionsList,
} from '@erp-services/permissions';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@erp-services/shared/components/button';
import { buttonStyleClass } from '@erp-services/shared/components/custom-confirm-dialog';
import {
  FindingsStatusStates,
  FindingsTagStates,
} from '@erp-services/shared/constants';

@Component({
  selector: 'lib-finding-respond-to',
  imports: [
    CommonModule,
    SharedButtonComponent,
    InputTextModule,
    ReactiveFormsModule,
    TranslocoDirective,
    Textarea,
    TooltipModule,
    ConfirmDialogModule,
  ],
  templateUrl: './finding-respond-to.component.html',
  styleUrl: './finding-respond-to.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingRespondToComponent implements OnInit {
  private _latestFindingResponses!: FindingResponsesModel | null;
  private isUrgencyCategory = false;
  public sharedButtonType = SharedButtonType;

  hasEditFindingPermission = this.profileStoreService.hasPermission(
    PermissionCategories.Findings,
    PermissionsList.Edit,
  );

  hasSubmitFindingPermission = this.profileStoreService.hasPermission(
    PermissionCategories.Findings,
    PermissionsList.Submit,
  );

  isSuaadhyaUser = this.settingsCoBrowsingStoreService.isSuaadhyaUser;

  @Input()
  isRespondInProgress!: boolean;

  @Input()
  set findingDetails(value: FindingDetailsModel | null) {
    if (!value) {
      return;
    }

    this.isUrgencyCategory =
      value.primaryLanguageDescription.category ===
        FindingsTagStates.Cat1Major ||
      value.primaryLanguageDescription.category === FindingsTagStates.Cat2Minor;

    this.isClosedStatus = value.header.status === FindingsStatusStates.Closed;

    this.shouldHideRespond = !this.isUrgencyCategory && this.isClosedStatus;
    this.isFormReadonly = this.isClosedStatus;
  }

  @Input()
  set latestFindingResponses(value: FindingResponsesModel | null) {
    this._latestFindingResponses = value;

    if (!value) {
      return;
    }

    this.noPreviousResponses = !!(!value.createdOn && !value.isSubmit);
    this.isFormReadonly = !this.noPreviousResponses;
    this.isSubmitted = value.isSubmit;
    this.isDraft = value.isDraft!;
    this.areAllResponsesAvailable = !!(
      value.formValue.correctionAction &&
      value.formValue.nonConformity &&
      value.formValue.rootCause
    );
  }

  get latestFindingResponses() {
    return this._latestFindingResponses;
  }

  @Output() sendForm = new EventEmitter<FindingResponsesModel>();
  @Output() formDirtyStateChanged = new EventEmitter<boolean>();

  form!: FormGroup;
  isSubmitted = false;
  isDraft = false;
  noPreviousResponses = true;
  isFormReadonly = false;
  areAllResponsesAvailable = false;
  shouldHideRespond = false;
  isClosedStatus = false;

  constructor(
    private ts: TranslocoService,
    private confirmationService: ConfirmationService,
    private readonly destroyRef: DestroyRef,
    public readonly profileStoreService: ProfileStoreService,
    private readonly settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.handleFormDirtyStateChanged();
  }

  get isAnyFormFieldEmpty(): boolean {
    const { controls } = this.form;

    return Object.keys(controls).some((controlName) => {
      const control = controls[controlName];

      return !control.value?.toString().trim();
    });
  }

  get areAllFormFieldsEmpty(): boolean {
    const { controls } = this.form;

    return Object.keys(controls).every((controlName) => {
      const control = controls[controlName];

      return !control.value?.toString().trim();
    });
  }

  onSubmitToSuaadhya(): void {
    this.confirmationService.confirm({
      header: this.ts.translate('findings.confirmationPopup.sendToSuaadhya'),
      message: this.ts.translate(
        'findings.confirmationPopup.youAreAboutToSubmitResponseToSuaadhya',
      ),
      acceptLabel: this.ts.translate('findings.confirmationPopup.submit'),
      rejectLabel: this.ts.translate('findings.confirmationPopup.cancel'),
      acceptButtonStyleClass: buttonStyleClass.noIcon,
      rejectButtonStyleClass: [
        buttonStyleClass.noIcon,
        buttonStyleClass.outlined,
      ].join(' '),
      accept: () => {
        this.emitSendFormEvent(true);
      },
    });
  }

  onSaveDraft(): void {
    this.isDraft = true;

    this.emitSendFormEvent(false);
  }

  onEditSubmittedResponse(): void {
    this.isSubmitted = false;
    this.enableFormWithPreviousResponses();
  }

  onContinueWithDraft(): void {
    this.isDraft = false;
    this.enableFormWithPreviousResponses();
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      nonConformity: new FormControl<string | null>(''),
      rootCause: new FormControl<string | null>(''),
      correctionAction: new FormControl<string | null>(''),
    });
  }

  private handleFormDirtyStateChanged(): void {
    this.form.valueChanges
      .pipe(
        map(() => this.form.dirty),
        distinctUntilChanged(),
        tap((isDirty) => {
          this.formDirtyStateChanged.emit(isDirty);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private emitSendFormEvent(shouldSubmit: boolean): void {
    let formValue: FindingResponsesFormModel = this.form.value;

    if (
      shouldSubmit &&
      this.isDraft &&
      this.latestFindingResponses?.formValue
    ) {
      formValue = this.latestFindingResponses.formValue;
    }

    const { nonConformity, rootCause, correctionAction } = formValue;

    this.sendForm.emit({
      isSubmit: shouldSubmit,
      formValue: {
        nonConformity,
        rootCause,
        correctionAction,
      },
    });
  }

  private enableFormWithPreviousResponses(): void {
    this.isFormReadonly = false;
    this.noPreviousResponses = true;

    if (this.latestFindingResponses?.formValue) {
      this.form.patchValue(this.latestFindingResponses.formValue);
    }
  }
}
