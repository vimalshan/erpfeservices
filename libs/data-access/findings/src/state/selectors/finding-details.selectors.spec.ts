import {
  applyGridConfig,
  getNumberOfFilteredRecords,
  GridFileActionType,
  isAnyFilterActive,
  SortingDirection,
  SortingMode,
} from '@customer-portal/shared';

import { FindingDetailsStateModel } from '../finding-details.state';
import { FindingDetailsSelectors } from './finding-details.selectors';

describe('FindingDetailsSelectors', () => {
  const state: FindingDetailsStateModel = {
    findingDetails: {
      findingNumber: 'F123',
      header: {
        site: 'Site A',
        city: 'City B',
        openDate: '2025-01-01',
        dueDate: '2025-02-01',
        closeDate: '2025-03-01',
        acceptedDate: '2025-01-15',
        auditor: 'Auditor X',
        auditType: 'Type Y',
        auditNumber: 'A12345',
        services: 'Service Z',
        status: 'Open',
      },
      primaryLanguageDescription: {
        category: 'Category 1',
        description: 'Description 1',
        clause: 'Clause 1',
        focusArea: 'Focus Area 1',
        language: 'en',
        isPrimaryLanguage: true,
        isSelected: true,
        title: 'Title 1',
      },
      secondaryLanguageDescription: {
        category: 'Category 2',
        description: 'Description 2',
        clause: 'Clause 2',
        focusArea: 'Focus Area 2',
        language: 'fr',
        isPrimaryLanguage: false,
        isSelected: false,
        title: 'Title 2',
      },
    },
    latestFindingResponses: {
      isSubmit: true,
      formValue: {
        nonConformity: 'nonConformity',
        rootCause: 'rootCause',
        correctionAction: 'correctionAction',
      },
    },
    responseHistory: [
      {
        isAuditor: true,
        auditorComment: 'comment',
        userName: 'username',
        responseDateTime: 'responseDateTime',
      },
    ],
    isRespondInProgress: true,
    documentsList: [
      {
        documentId: 1,
        fileName: 'File 1',
        fileType: 'document',
        dateAdded: '2025/03/06',
        uploadedBy: 'user',
        actions: [
          {
            label: 'document 1',
            iconClass: 'icon',
            actionType: GridFileActionType.Download,
          },
        ],
        canBeDeleted: false,
      },
    ],
    gridConfig: {
      filtering: {},
      sorting: {
        mode: SortingMode.Multiple,
        rules: [{ field: 'name', direction: SortingDirection.Ascending }],
      },
      pagination: { paginationEnabled: true, startIndex: 0, pageSize: 50 },
    },
    filterOptions: { option: [{ label: 'Option 1', value: 'Value1' }] },
    isFindingResponseFormDirty: true,
  };

  test('should select finding details', () => {
    // Arrange
    const intermediate = FindingDetailsSelectors['_findingDetails'](state);

    // Act
    const result = FindingDetailsSelectors.findingDetails(intermediate);

    // Assert
    expect(result).toEqual(state.findingDetails);
  });

  test('should select language options', () => {
    // Arrange
    const expectedResponse = [
      { language: 'en', isSelected: true },
      { language: 'fr', isSelected: false },
    ];
    const intermediate = FindingDetailsSelectors['_languageOptions'](state);

    // Act
    const result = FindingDetailsSelectors.languageOptions(intermediate);

    // Assert
    expect(result).toEqual(expectedResponse);
  });

  test('should select primary language description when it is selected', () => {
    // Arrange
    const intermediate =
      FindingDetailsSelectors['_findingDetailsDescription'](state);

    // Act
    const result =
      FindingDetailsSelectors.findingDetailsDescription(intermediate);

    // Assert
    expect(result).toEqual(state.findingDetails.primaryLanguageDescription);
  });

  test('should select secondary language description when primary is not selected', () => {
    // Arrange
    const expectedState = {
      ...state,
      findingDetails: {
        ...state.findingDetails,
        primaryLanguageDescription: {
          ...state.findingDetails.primaryLanguageDescription,
          isSelected: false,
        },
        secondaryLanguageDescription: {
          ...state.findingDetails.secondaryLanguageDescription,
          isSelected: true,
        },
      },
    };
    const intermediate =
      FindingDetailsSelectors['_findingDetailsDescription'](expectedState);

    // Act
    const result =
      FindingDetailsSelectors.findingDetailsDescription(intermediate);

    // Assert
    expect(result).toEqual(
      expectedState.findingDetails.secondaryLanguageDescription,
    );
  });

  test('should select latest finding responses', () => {
    // Arrange
    const intermediate =
      FindingDetailsSelectors['_latestFindingResponses'](state);

    // Act
    const result = FindingDetailsSelectors.latestFindingResponses(intermediate);

    // Assert
    expect(result).toEqual(state.latestFindingResponses);
  });

  test('should select isRespondInProgress', () => {
    // Arrange
    const intermediate = FindingDetailsSelectors['_isRespondInProgress'](state);

    // Act
    const result = FindingDetailsSelectors.isRespondInProgress(intermediate);

    // Assert
    expect(result).toBe(true);
  });

  test('should return true when finding status is Open', () => {
    // Arrange
    const intermediate =
      FindingDetailsSelectors['_isFindingOpenOrAccepted'](state);

    // Act
    const result =
      FindingDetailsSelectors.isFindingOpenOrAccepted(intermediate);

    // Assert
    expect(result).toBe(true);
  });

  test('should return true when finding status is Accepted', () => {
    // Arrange
    const expectedState = {
      ...state,
      findingDetails: {
        ...state.findingDetails,
        header: { ...state.findingDetails.header, status: 'Accepted' },
      },
    };
    const intermediate =
      FindingDetailsSelectors['_isFindingOpenOrAccepted'](expectedState);

    // Act
    const result =
      FindingDetailsSelectors.isFindingOpenOrAccepted(intermediate);

    // Assert
    expect(result).toBe(true);
  });

  test('should return false when finding status is neither Open nor Accepted', () => {
    // Arrange
    const expectedState = {
      ...state,
      findingDetails: {
        ...state.findingDetails,
        header: { ...state.findingDetails.header, status: 'Closed' },
      },
    };
    const intermediate =
      FindingDetailsSelectors['_isFindingOpenOrAccepted'](expectedState);

    // Act
    const result =
      FindingDetailsSelectors.isFindingOpenOrAccepted(intermediate);

    // Assert
    expect(result).toBe(false);
  });

  test('should return true if response history is available', () => {
    // Arrange
    const intermediate =
      FindingDetailsSelectors['_isResponseHistoryAvailable'](state);

    // Act
    const result =
      FindingDetailsSelectors.isResponseHistoryAvailable(intermediate);

    // Assert
    expect(result).toBe(true);
  });

  test('should return response history', () => {
    // Arrange
    const intermediate = FindingDetailsSelectors['_responseHistory'](state);

    // Act
    const result = FindingDetailsSelectors.responseHistory(intermediate);

    // Assert
    expect(result).toEqual(state.responseHistory);
  });

  test('should return gridConfig filtering', () => {
    // Arrange
    const intermediate = FindingDetailsSelectors['_filteringConfig'](state);

    // Act
    const result = FindingDetailsSelectors.filteringConfig(intermediate);

    // Assert
    expect(result).toEqual(state.gridConfig.filtering);
  });

  test('should return filter options', () => {
    // Arrange
    const intermediate = FindingDetailsSelectors['_filterOptions'](state);

    // Act
    const result = FindingDetailsSelectors.filterOptions(intermediate);

    // Assert
    expect(result).toEqual(state.filterOptions);
  });

  test('should return documents list', () => {
    // Arrange
    const expectedResponse = applyGridConfig(
      state.documentsList,
      state.gridConfig,
    );
    const intermediate = FindingDetailsSelectors['_documentsList'](state);

    // Act
    const result = FindingDetailsSelectors.documentsList(intermediate);

    // Assert
    expect(result).toEqual(expectedResponse);
  });

  test('should return total filtered documents list records', () => {
    // Arrange
    const expectedResponse = getNumberOfFilteredRecords(
      state.documentsList,
      state.gridConfig,
    );
    const intermediate =
      FindingDetailsSelectors['_documentsListTotalFilteredRecords'](state);

    // Act
    const result =
      FindingDetailsSelectors.documentsListTotalFilteredRecords(intermediate);

    // Assert
    expect(result).toEqual(expectedResponse);
  });

  test('should return if documents list has active filters', () => {
    // Arrange
    const expectedResponse = isAnyFilterActive(state.gridConfig.filtering);
    const intermediate =
      FindingDetailsSelectors['_documentsListHasActiveFilters'](state);

    // Act
    const result =
      FindingDetailsSelectors.documentsListHasActiveFilters(intermediate);

    // Assert
    expect(result).toEqual(expectedResponse);
  });

  test('should return auditId', () => {
    // Arrange
    const expectedResponse = state.findingDetails.header.auditNumber || '';
    const intermediate = FindingDetailsSelectors['_auditId'](state);

    // Act
    const result = FindingDetailsSelectors.auditId(intermediate);

    // Assert
    expect(result).toEqual(expectedResponse);
  });

  test('should return if finding response form is dirty', () => {
    // Arrange
    const expectedResponse = state.isFindingResponseFormDirty;
    const intermediate =
      FindingDetailsSelectors['_isFindingResponseFormDirty'](state);

    // Act
    const result =
      FindingDetailsSelectors.isFindingResponseFormDirty(intermediate);

    // Assert
    expect(result).toEqual(expectedResponse);
  });
});
