import { ConfirmationService } from 'primeng/api';

import {
  createFindingDetailsStoreServiceMock,
  FindingDetailsStoreService,
  FindingResponsesModel,
} from '@customer-portal/data-access/findings';
import { FINDINGS_TAG_STATES_MAP } from '@customer-portal/shared';

import { FindingManageContentComponent } from './finding-manage-content.component';

describe('FindingManageContentComponent', () => {
  let component: FindingManageContentComponent;
  const findingsDetailsStoreServiceMock: Partial<FindingDetailsStoreService> =
    createFindingDetailsStoreServiceMock();

  jest.mock('primeng/api', () => ({
    ConfirmationService: jest.fn().mockImplementation(() => ({
      confirm: jest.fn(),
    })),
  }));

  const mockedConfirmationService: Partial<ConfirmationService> = {
    confirm: jest.fn(),
  };

  beforeEach(() => {
    component = new FindingManageContentComponent(
      findingsDetailsStoreServiceMock as FindingDetailsStoreService,
      mockedConfirmationService as ConfirmationService,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should have default tagStatesMap', () => {
    // Assert
    expect(component.tagStatesMap).toBe(FINDINGS_TAG_STATES_MAP);
  });

  test('should return language options', () => {
    // Assert
    expect(component.languages).toEqual(
      findingsDetailsStoreServiceMock.languageOptions?.(),
    );
  });

  test('should return finding details', () => {
    // Assert
    expect(component.details()).toEqual(
      findingsDetailsStoreServiceMock.findingDetailsDescription?.(),
    );
  });

  test('should call sendFindingRespondForm with correct parameters', () => {
    // Arrange
    const event = {} as FindingResponsesModel;
    // Act
    component.onSendForm(event);

    // Assert
    expect(
      findingsDetailsStoreServiceMock.sendFindingResponsesForm,
    ).toHaveBeenCalledWith(event);
    expect(
      findingsDetailsStoreServiceMock.setIsFindingResponseFormDirtyFlag,
    ).toHaveBeenCalledWith(false);
  });

  test('should call changeFindingDetailsLanguage with correct parameter', () => {
    // Arrange
    const spy = jest.spyOn(
      findingsDetailsStoreServiceMock,
      'changeFindingDetailsLanguage',
    );

    // Act
    component.onSelectedLanguageChanged('English');

    // Assert
    expect(spy).toHaveBeenCalledWith('English');
  });
});
