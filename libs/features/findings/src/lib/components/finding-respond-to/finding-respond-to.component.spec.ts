import { DestroyRef } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';

import {
  FindingResponsesFormModel,
  FindingResponsesModel,
} from '@customer-portal/data-access/findings';
import {
  createProfileStoreServiceMock,
  createSettingsCoBrowsingStoreServiceMock,
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import {
  createDestroyRefMock,
  createTranslationServiceMock,
  FindingsStatusStates,
  FindingsTagStates,
} from '@customer-portal/shared';

import { FindingRespondToComponent } from './finding-respond-to.component';

jest.mock('primeng/api', () => ({
  ConfirmationService: jest.fn().mockImplementation(() => ({
    confirm: jest.fn(),
  })),
}));

describe('FindingRespondToComponent', () => {
  let component: FindingRespondToComponent;
  let sendFormEmitSpy: any;

  const mockedConfirmationService: Partial<ConfirmationService> = {
    confirm: jest.fn(),
  };
  const destroyRefMock: Partial<DestroyRef> = createDestroyRefMock();

  const profileStoreServiceMock: Partial<ProfileStoreService> =
    createProfileStoreServiceMock();

  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(async () => {
    component = new FindingRespondToComponent(
      createTranslationServiceMock() as TranslocoService,
      mockedConfirmationService as ConfirmationService,
      destroyRefMock as DestroyRef,
      profileStoreServiceMock as ProfileStoreService,
      settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
    );
    sendFormEmitSpy = jest.spyOn(component.sendForm, 'emit');
    component.ngOnInit();
  });

  test('should check if form has any field empty or null', () => {
    // Arrange
    const testCases = [
      {
        nonConformity: '',
        rootCause: 'value',
        correctionAction: 'value',
        expectedResult: true,
      },
      {
        nonConformity: ' ',
        rootCause: 'value',
        correctionAction: 'value',
        expectedResult: true,
      },
      {
        nonConformity: null,
        rootCause: 'value',
        correctionAction: 'value',
        expectedResult: true,
      },
      {
        nonConformity: 'value',
        rootCause: 'value',
        correctionAction: 'value',
        expectedResult: false,
      },
    ];

    testCases.forEach((testCase) => {
      component.form.controls['nonConformity'].setValue(testCase.nonConformity);
      component.form.controls['rootCause'].setValue(testCase.rootCause);
      component.form.controls['correctionAction'].setValue(
        testCase.correctionAction,
      );
      // Act
      const actualResult = component.isAnyFormFieldEmpty;

      // Assert
      expect(actualResult).toBe(testCase.expectedResult);
    });
  });

  test('should check if form has all fields empty or null', () => {
    // Arrange
    const testCases = [
      {
        nonConformity: '',
        rootCause: '',
        correctionAction: '',
        expectedResult: true,
      },
      {
        nonConformity: ' ',
        rootCause: ' ',
        correctionAction: ' ',
        expectedResult: true,
      },
      {
        nonConformity: null,
        rootCause: null,
        correctionAction: null,
        expectedResult: true,
      },
      {
        nonConformity: 'value',
        rootCause: 'value',
        correctionAction: 'value',
        expectedResult: false,
      },
    ];

    testCases.forEach((testCase) => {
      component.form.controls['nonConformity'].setValue(testCase.nonConformity);
      component.form.controls['rootCause'].setValue(testCase.rootCause);
      component.form.controls['correctionAction'].setValue(
        testCase.correctionAction,
      );
      // Act
      const actualResult = component.areAllFormFieldsEmpty;

      // Assert
      expect(actualResult).toBe(testCase.expectedResult);
    });
  });

  test('should save draft', () => {
    // Arrange
    const nonConformity = 'nonConformity';
    const rootCause = 'rootCause';
    const correctionAction = 'correctionAction';

    component.isDraft = false;
    component.form.patchValue({
      nonConformity,
      rootCause,
      correctionAction,
    });
    const expectedParams = {
      formValue: {
        correctionAction,
        nonConformity,
        rootCause,
      },
      isSubmit: false,
    };

    // Act
    component.onSaveDraft();

    // Assert
    expect(component.isDraft).toBe(true);
    expect(sendFormEmitSpy).toHaveBeenCalledWith(expectedParams);
  });

  test('should submit reponses to dnv', () => {
    // Arrange
    const confirmationService = new ConfirmationService();
    component['confirmationService'] = confirmationService;
    (confirmationService.confirm as jest.Mock).mockImplementation(
      (confirmation) => {
        confirmation.accept();
      },
    );

    const nonConformity = 'nonConformity';
    const rootCause = 'rootCause';
    const correctionAction = 'correctionAction';
    component.latestFindingResponses = {
      formValue: {
        correctionAction,
        nonConformity,
        rootCause,
      },
      createdOn: '123',
      isSubmit: false,
      isDraft: true,
    };
    const expectedParams = {
      formValue: {
        correctionAction,
        nonConformity,
        rootCause,
      },
      isSubmit: true,
    };

    // Act
    component.onSubmitToDnv();

    // Assert
    expect(sendFormEmitSpy).toHaveBeenCalledWith(expectedParams);
  });

  describe('Input set latestFindingResponses', () => {
    test('should handle null value', () => {
      // Act
      component.latestFindingResponses = null;

      // Assert
      expect(component.latestFindingResponses).toBeNull();
      expect(component.noPreviousResponses).toBe(true);
      expect(component.isFormReadonly).toBe(false);
      expect(component.isSubmitted).toBe(false);
      expect(component.isDraft).toBe(false);
      expect(component.areAllResponsesAvailable).toBe(false);
    });

    test('should handle no previous responses', () => {
      // Arrange
      const value: any = {
        createdOn: null,
        isSubmit: false,
        formValue: {},
        isDraft: false,
      };

      // Act
      component.latestFindingResponses = value;

      // Assert
      expect(component.latestFindingResponses).toEqual(value);
      expect(component.noPreviousResponses).toBe(true);
      expect(component.isFormReadonly).toBe(false);
      expect(component.isSubmitted).toBe(false);
      expect(component.isDraft).toBe(false);
      expect(component.areAllResponsesAvailable).toBe(false);
    });

    test('should handle submitted form', () => {
      // Arrange
      const value: any = {
        createdOn: '12-01-1999',
        isSubmit: true,
        formValue: {},
        isDraft: true,
      };

      // Act
      component.latestFindingResponses = value;

      // Arrange
      expect(component.latestFindingResponses).toEqual(value);
      expect(component.noPreviousResponses).toBe(false);
      expect(component.isFormReadonly).toBe(true);
      expect(component.isSubmitted).toBe(true);
      expect(component.isDraft).toBe(true);
      expect(component.areAllResponsesAvailable).toBe(false);
    });
  });

  describe('Input set findingDetails', () => {
    test('should handle null value', () => {
      // Act
      component.findingDetails = null;

      // Assert
      expect((component as any).isUrgencyCategory).toBe(false);
      expect(component.isClosedStatus).toBe(false);
      expect(component.shouldHideRespond).toBe(false);
    });

    test('should handle urgency category for open finding', () => {
      // Act
      component.findingDetails = {
        primaryLanguageDescription: {
          category: FindingsTagStates.Cat1Major,
        },
        header: FindingsStatusStates.Open,
      } as any;

      // Assert
      expect((component as any).isUrgencyCategory).toBe(true);
      expect(component.isClosedStatus).toBe(false);
      expect(component.shouldHideRespond).toBe(false);
    });

    test('should handle urgency category for closed finding', () => {
      // Act
      component.findingDetails = {
        primaryLanguageDescription: {
          category: FindingsTagStates.Cat1Major,
        },
        header: {
          status: FindingsStatusStates.Closed,
        },
      } as any;

      // Assert
      expect((component as any).isUrgencyCategory).toBe(true);
      expect(component.isClosedStatus).toBe(true);
      expect(component.shouldHideRespond).toBe(false);
      expect(component.isFormReadonly).toBe(true);
    });

    test('should handle non urgency category for closed finding', () => {
      // Act
      component.findingDetails = {
        primaryLanguageDescription: {
          category: FindingsTagStates.Observation,
        },
        header: {
          status: FindingsStatusStates.Closed,
        },
      } as any;

      // Assert
      expect((component as any).isUrgencyCategory).toBe(false);
      expect(component.isClosedStatus).toBe(true);
      expect(component.shouldHideRespond).toBe(true);
    });
  });

  test('should edit draft response', () => {
    // Arrange
    component.isDraft = true;
    component.isFormReadonly = true;
    component.noPreviousResponses = false;
    const formValue: FindingResponsesFormModel = {
      rootCause: 'rootCause',
      correctionAction: 'correctionAction',
      nonConformity: 'nonConformity',
    };
    component.latestFindingResponses = { formValue } as FindingResponsesModel;

    // Act
    component.onContinueWithDraft();

    // Assert
    expect(component.isDraft).toBe(false);
    expect(component.isFormReadonly).toBe(false);
    expect(component.noPreviousResponses).toBe(true);
    expect(component.form.value).toEqual(formValue);
  });

  test('should edit submitted response', () => {
    // Arrange
    component.isSubmitted = true;
    component.isFormReadonly = true;
    component.noPreviousResponses = false;
    const formValue: FindingResponsesFormModel = {
      rootCause: 'rootCause',
      correctionAction: 'correctionAction',
      nonConformity: 'nonConformity',
    };
    component.latestFindingResponses = { formValue } as FindingResponsesModel;

    // Act
    component.onEditSubmittedResponse();

    // Assert
    expect(component.isSubmitted).toBe(false);
    expect(component.isFormReadonly).toBe(false);
    expect(component.noPreviousResponses).toBe(true);
    expect(component.form.value).toEqual(formValue);
  });
});
