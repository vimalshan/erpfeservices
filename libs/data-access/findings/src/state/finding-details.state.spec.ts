import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { NgxsModule, Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { UnreadActionsStoreService } from '@customer-portal/data-access/actions';
import {
  createProfileStoreServiceMock,
  createSettingsCoBrowsingStoreServiceMock,
  createUnreadActionsStoreService,
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import {
  PermissionCategories,
  PermissionsList,
} from '@customer-portal/permissions';
import {
  createRouteStoreServiceMock,
  RouteStoreService,
} from '@customer-portal/router';
import {
  createMessageServiceMock,
  DEFAULT_GRID_CONFIG,
  GridFileActionType,
  SortingMode,
} from '@customer-portal/shared';

import {
  FindingDetailsDto,
  FindingDocumentsListDto,
  FindingResponsesDto,
  FindingResponsesPayloadDto,
  ManageFindingDetailsDto,
} from '../dtos';
import {
  FindingDetailsModel,
  FindingDocumentListItemModel,
  FindingResponsesModel,
} from '../models';
import {
  FindingDetailsService,
  FindingDocumentsListService,
  FindingResponseHistoryService,
} from '../services';
import {
  ChangeFindingDetailsLanguage,
  LoadFindingDetails,
  LoadFindingDetailsSuccess,
  LoadFindingDocumentsList,
  LoadLatestFindingResponses,
  LoadResponseFindingsHistory,
  ResetFindingDetailsState,
  SendFindingResponsesForm,
} from './actions';
import {
  FindingDetailsState,
  FindingDetailsStateModel,
} from './finding-details.state';
import { FindingDetailsSelectors } from './selectors';

describe('FindingDetailsState', () => {
  let store: Store;

  const findingDetailsServiceMock = {
    getFindingDetails: jest.fn().mockReturnValue(of({})),
    respondToFindings: jest.fn().mockReturnValue(of({})),
    getLatestFindingResponses: jest.fn().mockReturnValue(of({})),
    getManageFindingDetails: jest.fn().mockReturnValue(of({})),
  };

  const findingResponseHistoryServiceMock = {
    getFindingResponseHistory: jest.fn().mockReturnValue(of({})),
  };

  const findingDocumentsListServiceMock = {
    getFindingDocumentsList: jest.fn(),
  };

  const profileStoreServiceMock = createProfileStoreServiceMock();

  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();
  const unreadActionsStoreServiceMock: Partial<UnreadActionsStoreService> =
    createUnreadActionsStoreService();

  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();

  const mockTranslocoService: Partial<TranslocoService> = {
    translate: jest.fn().mockReturnValue('Translated Text'),
  };

  beforeAll(() => {
    const originalDateResolvedOptions =
      new Intl.DateTimeFormat().resolvedOptions();
    jest
      .spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
      .mockReturnValue({
        ...originalDateResolvedOptions,
        timeZone: 'Australia/Melbourne',
      });
  });

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([FindingDetailsState])],
      providers: [
        {
          provide: FindingDetailsService,
          useValue: findingDetailsServiceMock,
        },
        {
          provide: FindingResponseHistoryService,
          useValue: findingResponseHistoryServiceMock,
        },
        {
          provide: FindingDocumentsListService,
          useValue: findingDocumentsListServiceMock,
        },
        {
          provide: RouteStoreService,
          useValue: createRouteStoreServiceMock(),
        },
        {
          provide: ProfileStoreService,
          useValue: profileStoreServiceMock,
        },
        {
          provide: SettingsCoBrowsingStoreService,
          useValue: settingsCoBrowsingStoreServiceMock,
        },
        {
          provide: UnreadActionsStoreService,
          useValue: unreadActionsStoreServiceMock,
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
        {
          provide: TranslocoService,
          useValue: mockTranslocoService,
        },
      ],
    });
    store = TestBed.inject(Store);
  });

  test('should request finding details and save transformed result into the state', () => {
    // Arrange
    const findingsId = 'MANMES-0031';

    const mockedFindingDetailsResponse: FindingDetailsDto = {
      data: {
        findingNumber: findingsId,
        status: 'Open',
        auditors: ['Auditor'],
        services: ['IFS Food version 8 April 2023', 'FSC-STD-40-004 V3-1'],
        sites: [
          {
            siteName: 'DNV GL GSS IT',
            siteAddress: 'Arnhem',
          },
        ],
        auditId: '3067486',
        openedDate: '2024-05-18',
        dueDate: '2024-06-18',
        closedDate: '2024-07-18',
        acceptedDate: '2024-08-18',
        auditType: 'CAT1 (major)',
      },
      isSuccess: true,
    };

    const mockedManageFindingDetailsResponse: ManageFindingDetailsDto = {
      data: {
        category: 'CAT1 - Major',
        clauses: ['Clause'],
        descriptionInPrimaryLanguage: 'Description in English',
        descriptionInSecondaryLanguage: 'Description in Norwegian',
        primaryLanguage: 'English',
        secondaryLanguage: 'Norwegian',
        titleInPrimaryLanguage: 'Title in English',
        titleInSecondaryLanguage: 'Title in Norwegian',
        focusAreas: [
          {
            focusAreaInPrimaryLanguage: 'Focus Area in English',
            focusAreaInSecondaryLanguage: 'Focus Area in Norwegian',
          },
        ],
      },
      isSuccess: true,
    };

    jest
      .spyOn(findingDetailsServiceMock, 'getFindingDetails')
      .mockReturnValue(of(mockedFindingDetailsResponse));

    jest
      .spyOn(findingDetailsServiceMock, 'getManageFindingDetails')
      .mockReturnValue(of(mockedManageFindingDetailsResponse));

    const expectedFindingsInState: FindingDetailsStateModel = {
      findingDetails: {
        findingNumber: findingsId,
        header: {
          acceptedDate: '18.08.2024',
          auditNumber: '3067486',
          auditType: 'CAT1 (major)',
          auditor: 'Auditor',
          city: 'Arnhem',
          closeDate: '18.07.2024',
          dueDate: '18.06.2024',
          openDate: '18.05.2024',
          site: 'DNV GL GSS IT',
          services: 'IFS Food version 8 April 2023, FSC-STD-40-004 V3-1',
          status: 'Open',
        },
        primaryLanguageDescription: {
          category: 'CAT1 - Major',
          clause: 'Clause',
          description: 'Description in English',
          focusArea: 'Focus Area in English',
          language: 'English',
          isPrimaryLanguage: true,
          isSelected: true,
          title: 'Title in English',
        },
        secondaryLanguageDescription: {
          category: 'CAT1 - Major',
          clause: 'Clause',
          description: 'Description in Norwegian',
          focusArea: 'Focus Area in Norwegian',
          language: 'Norwegian',
          isPrimaryLanguage: false,
          isSelected: false,
          title: 'Title in Norwegian',
        },
      },
      latestFindingResponses: null,
      isRespondInProgress: false,
      isFindingResponseFormDirty: false,
      responseHistory: [],
      documentsList: [],
      gridConfig: {
        pagination: {
          paginationEnabled: true,
          pageSize: 10,
          startIndex: 0,
        },
        sorting: {
          mode: SortingMode.Multiple,
          rules: [],
        },
        filtering: {},
      },
      filterOptions: {},
    };

    // Act
    store.dispatch(new LoadFindingDetails());

    const actualFindingsInState = store.selectSnapshot(
      (state) => state.findingDetails,
    );

    // Assert
    expect(actualFindingsInState).toEqual(expectedFindingsInState);
  });

  describe('SendFindingResponsesForm', () => {
    const findingNumber = 'MANMES-0031';
    const submitModel: FindingResponsesModel = {
      formValue: {
        nonConformity: '111',
        rootCause: '123',
        correctionAction: '234',
      },
      isSubmit: true,
    };

    beforeEach(() => {
      store.reset({
        findingDetails: {
          findingDetails: {
            findingNumber,
            header: {
              auditNumber: '123',
            },
          },
          isRespondInProgress: true,
        },
      });
    });

    test('should send respond to finding form values', () => {
      // Arrange
      const expectedDto: FindingResponsesPayloadDto = {
        request: {
          findingNumber: 'MANMES-0031',
          isSubmitToDnv: true,
          rootCause: '123',
          correctiveAction: '234',
          correction: '111',
        },
      };
      findingDetailsServiceMock.respondToFindings = jest.fn().mockReturnValue(
        of({
          data: {
            respondFinding: {
              isSuccess: true,
            },
          },
        }),
      );

      // Act
      store.dispatch(new SendFindingResponsesForm(submitModel));

      // Assert
      expect(findingDetailsServiceMock.respondToFindings).toHaveBeenCalledWith(
        expectedDto,
      );
    });

    test('should reset is respond in progress flag when response is not succesffully', () => {
      // Arrange
      findingDetailsServiceMock.respondToFindings = jest.fn().mockReturnValue(
        of({
          data: {
            respondFinding: {
              isSuccess: false,
            },
          },
        }),
      );

      // Act
      store.dispatch(new SendFindingResponsesForm(submitModel));
      const actualIsRespondInProgress = store.selectSnapshot(
        FindingDetailsSelectors.isRespondInProgress,
      );

      // Assert
      expect(actualIsRespondInProgress).toBe(false);
    });

    test('should reset is respond in progress flag when request throws an exception', () => {
      // Arrange
      jest.spyOn(console, 'error').mockImplementationOnce(() => {});

      findingDetailsServiceMock.respondToFindings = jest
        .fn()
        .mockReturnValue(throwError(() => new Error('test 404 error')));

      // Act
      store.dispatch(new SendFindingResponsesForm(submitModel));
      const actualIsRespondInProgress = store.selectSnapshot(
        FindingDetailsSelectors.isRespondInProgress,
      );

      // Assert
      expect(actualIsRespondInProgress).toBe(false);
    });
  });

  test('should change finding details language by setting the isSelected flag properly', () => {
    // Arrange
    const findingsModel: FindingDetailsModel = {
      findingNumber: 'MANMES-0031',
      header: {
        acceptedDate: '18-05-2024',
        auditNumber: '3067486',
        auditType: 'CAT1 (major)',
        auditor: 'Auditor',
        city: 'Arnhem',
        closeDate: '18-05-2024',
        dueDate: '18-05-2024',
        openDate: '18-05-2024',
        site: 'DNV GL GSS IT',
        services: 'IFS Food version 8 April 2023 || FSC-STD-40-004 V3-1',
        status: 'Open',
      },
      primaryLanguageDescription: {
        category: 'CAT1 - Major',
        clause: 'Clause',
        description: 'Description',
        focusArea: 'Focus Area',
        language: 'English',
        isPrimaryLanguage: true,
        isSelected: true,
        title: 'Title',
      },
      secondaryLanguageDescription: {
        category: 'CAT1 - Major',
        clause: 'Clause',
        description: 'Description',
        focusArea: 'Focus Area',
        language: 'Norwegian',
        isPrimaryLanguage: false,
        isSelected: false,
        title: 'Title',
      },
    };

    const expectedFindingsInState: FindingDetailsStateModel = {
      findingDetails: {
        findingNumber: 'MANMES-0031',
        header: {
          acceptedDate: '18-05-2024',
          auditNumber: '3067486',
          auditType: 'CAT1 (major)',
          auditor: 'Auditor',
          city: 'Arnhem',
          closeDate: '18-05-2024',
          dueDate: '18-05-2024',
          openDate: '18-05-2024',
          site: 'DNV GL GSS IT',
          services: 'IFS Food version 8 April 2023 || FSC-STD-40-004 V3-1',
          status: 'Open',
        },
        primaryLanguageDescription: {
          category: 'CAT1 - Major',
          clause: 'Clause',
          description: 'Description',
          focusArea: 'Focus Area',
          language: 'English',
          isPrimaryLanguage: true,
          isSelected: false,
          title: 'Title',
        },
        secondaryLanguageDescription: {
          category: 'CAT1 - Major',
          clause: 'Clause',
          description: 'Description',
          focusArea: 'Focus Area',
          language: 'Norwegian',
          isPrimaryLanguage: false,
          isSelected: true,
          title: 'Title',
        },
      },
      latestFindingResponses: null,
      isRespondInProgress: false,
      isFindingResponseFormDirty: false,
      responseHistory: [],
      documentsList: [],
      gridConfig: {
        pagination: {
          paginationEnabled: true,
          pageSize: 10,
          startIndex: 0,
        },
        sorting: {
          mode: SortingMode.Multiple,
          rules: [],
        },
        filtering: {},
      },
      filterOptions: {},
    };

    store.dispatch(new LoadFindingDetailsSuccess(findingsModel));

    // Act
    store.dispatch(new ChangeFindingDetailsLanguage('Norwegian'));

    const actualFindingsInState = store.selectSnapshot(
      (state) => state.findingDetails,
    );

    // Assert
    expect(actualFindingsInState).toEqual(expectedFindingsInState);
  });

  test('should request finding details response history and save transformed result into the state', () => {
    // Arrange
    const mockedResponseHistory = {
      data: [
        {
          auditorComments: [
            {
              updatedOn: '2024-05-01T15:44:00.000+02:00',
              updatedBy: 'Arne Arnesson',
              commentsInPrimaryLanguage:
                'Please provide a better explanation of the root cause.',
              commentsInSecondaryLanguage: '',
              responseCommentId: 11,
            },
          ],
          previousResponse: {
            updatedBy: 'Marq Sanches',
            correctionInPrimaryLanguage: 'Correction',
            correctionInSecondaryLanguage: '',
            rootCauseInPrimaryLanguage: 'Root Cause',
            rootCauseInSecondaryLanguage: '',
            correctiveActionInPrimaryLanguage: 'Corrective Action',
            correctiveActionInSecondaryLanguage: '',
            responseId: 22,
            updatedOn: '2024-05-01T11:23:00.000+00:00',
          },
        },
        {
          auditorComments: [],
          previousResponse: {
            updatedBy: 'Marq Sanches',
            correctionInPrimaryLanguage: 'Correction',
            correctionInSecondaryLanguage: '',
            rootCauseInPrimaryLanguage: 'Root Cause',
            rootCauseInSecondaryLanguage: '',
            correctiveActionInPrimaryLanguage: 'Corrective Action',
            correctiveActionInSecondaryLanguage: '',
            responseId: 22,
            updatedOn: '2024-05-01T21:37:00.000+03:00',
          },
        },
      ],
    };
    jest
      .spyOn(findingResponseHistoryServiceMock, 'getFindingResponseHistory')
      .mockReturnValue(of(mockedResponseHistory));

    const expectedResponseHistory = [
      {
        userName: 'Marq Sanches',
        isAuditor: false,
        responseDateTime: '01.05.2024 21:23',
        rootCause: 'Root Cause',
        correctiveAction: 'Corrective Action',
        correction: 'Correction',
      },
      {
        userName: 'DNV | Arne Arnesson',
        isAuditor: true,
        responseDateTime: '01.05.2024 23:44',
        auditorComment:
          'Please provide a better explanation of the root cause.',
      },
      {
        userName: 'Marq Sanches',
        isAuditor: false,
        responseDateTime: '02.05.2024 04:37',
        rootCause: 'Root Cause',
        correctiveAction: 'Corrective Action',
        correction: 'Correction',
      },
    ];

    // Act
    store.dispatch(new LoadResponseFindingsHistory());

    const actualFindingsInState = store.selectSnapshot(
      (state) => state.findingDetails.responseHistory,
    );

    // Assert
    expect(actualFindingsInState).toEqual(expectedResponseHistory);
  });

  test('should request finding documents, save transformed result into the state and fill documentsList in state when findings edit permission is true', () => {
    // Arrange
    const mockedFindingDocumentsList: FindingDocumentsListDto = {
      data: [
        {
          documentId: 0,
          fileName: 'ImageScan_Cannon3XDS_193740573023097.png',
          type: 'Evidence',
          dateAdded: '2024-06-12T00:00:00.000+00:00',
          uploadedBy: 'DNV Arne Arnesson',
          documentUrl:
            'https://file-examples.com/wp-content/storage/2017/10/file_example_JPG_100kB.jpg',
          canBeDeleted: true,
        },
        {
          documentId: 1,
          fileName: 'Audit_plan_22042024.pdf',
          type: 'Evidence',
          dateAdded: '2024-06-12T00:00:00.000+00:00',
          uploadedBy: 'DNV Arne Arnesson',
          documentUrl:
            'https://file-examples.com/wp-content/storage/2017/10/file-sample_150kB.pdf',
          canBeDeleted: true,
        },
        {
          documentId: 2,
          fileName: 'Document_01.pdf',
          type: 'Other',
          dateAdded: '2024-06-12T00:00:00.000+00:00',
          uploadedBy: 'Marq Sanches',
          documentUrl:
            'https://file-examples.com/wp-content/storage/2017/10/file_example_JPG_100kB.jpg',
          canBeDeleted: true,
        },
      ],
      isSuccess: true,
      message: '',
    };

    const expectedFindingDocumentsInState: FindingDocumentListItemModel[] = [
      {
        documentId: 0,
        fileName: 'ImageScan_Cannon3XDS_193740573023097.png',
        fileType: 'Evidence',
        dateAdded: '12-06-2024',
        uploadedBy: 'DNV Arne Arnesson',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'https://file-examples.com/wp-content/storage/2017/10/file_example_JPG_100kB.jpg',
            actionType: GridFileActionType.Download,
          },
          {
            actionType: GridFileActionType.Delete,
            iconClass: 'pi-trash',
            label: 'delete',
          },
        ],
        canBeDeleted: true,
      },
      {
        documentId: 1,
        fileName: 'Audit_plan_22042024.pdf',
        fileType: 'Evidence',
        dateAdded: '12-06-2024',
        uploadedBy: 'DNV Arne Arnesson',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'https://file-examples.com/wp-content/storage/2017/10/file-sample_150kB.pdf',
            actionType: GridFileActionType.Download,
          },
          {
            actionType: GridFileActionType.Delete,
            iconClass: 'pi-trash',
            label: 'delete',
          },
        ],
        canBeDeleted: true,
      },
      {
        documentId: 2,
        fileName: 'Document_01.pdf',
        fileType: 'Other',
        dateAdded: '12-06-2024',
        uploadedBy: 'Marq Sanches',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'https://file-examples.com/wp-content/storage/2017/10/file_example_JPG_100kB.jpg',
            actionType: GridFileActionType.Download,
          },
          {
            label: 'delete',
            iconClass: 'pi-trash',
            actionType: GridFileActionType.Delete,
          },
        ],
        canBeDeleted: true,
      },
    ];

    jest
      .spyOn(findingDocumentsListServiceMock, 'getFindingDocumentsList')
      .mockReturnValue(of(mockedFindingDocumentsList));
    jest
      .spyOn(profileStoreServiceMock, 'hasPermission')
      .mockReturnValue(() => true);

    // Act
    store.dispatch(new LoadFindingDocumentsList());

    const actualFindingDocumentsInState = store.selectSnapshot(
      (state) => state.findingDetails.documentsList,
    );

    // Assert
    expect(profileStoreServiceMock.hasPermission).toHaveBeenCalledWith(
      PermissionCategories.Findings,
      PermissionsList.Edit,
    );
    expect(actualFindingDocumentsInState).toEqual(
      expectedFindingDocumentsInState,
    );
  });

  test('should request finding documents, save transformed result into the state and fill documentsList in state when findings edit permission is false', () => {
    // Arrange
    const mockedFindingDocumentsList: FindingDocumentsListDto = {
      data: [
        {
          documentId: 0,
          fileName: 'ImageScan_Cannon3XDS_193740573023097.png',
          type: 'Evidence',
          dateAdded: '2024-06-12T00:00:00.000+00:00',
          uploadedBy: 'DNV Arne Arnesson',
          documentUrl:
            'https://file-examples.com/wp-content/storage/2017/10/file_example_JPG_100kB.jpg',
          canBeDeleted: true,
        },
        {
          documentId: 1,
          fileName: 'Audit_plan_22042024.pdf',
          type: 'Evidence',
          dateAdded: '2024-06-12T00:00:00.000+00:00',
          uploadedBy: 'DNV Arne Arnesson',
          documentUrl:
            'https://file-examples.com/wp-content/storage/2017/10/file-sample_150kB.pdf',
          canBeDeleted: true,
        },
        {
          documentId: 2,
          fileName: 'Document_01.pdf',
          type: 'Other',
          dateAdded: '2024-06-12T00:00:00.000+00:00',
          uploadedBy: 'Marq Sanches',
          documentUrl:
            'https://file-examples.com/wp-content/storage/2017/10/file_example_JPG_100kB.jpg',
          canBeDeleted: true,
        },
      ],
      isSuccess: true,
      message: '',
    };

    const expectedFindingDocumentsInState: FindingDocumentListItemModel[] = [
      {
        documentId: 0,
        fileName: 'ImageScan_Cannon3XDS_193740573023097.png',
        fileType: 'Evidence',
        dateAdded: '12-06-2024',
        uploadedBy: 'DNV Arne Arnesson',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'https://file-examples.com/wp-content/storage/2017/10/file_example_JPG_100kB.jpg',
            actionType: GridFileActionType.Download,
          },
        ],
        canBeDeleted: true,
      },
      {
        documentId: 1,
        fileName: 'Audit_plan_22042024.pdf',
        fileType: 'Evidence',
        dateAdded: '12-06-2024',
        uploadedBy: 'DNV Arne Arnesson',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'https://file-examples.com/wp-content/storage/2017/10/file-sample_150kB.pdf',
            actionType: GridFileActionType.Download,
          },
        ],
        canBeDeleted: true,
      },
      {
        documentId: 2,
        fileName: 'Document_01.pdf',
        fileType: 'Other',
        dateAdded: '12-06-2024',
        uploadedBy: 'Marq Sanches',
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: 'https://file-examples.com/wp-content/storage/2017/10/file_example_JPG_100kB.jpg',
            actionType: GridFileActionType.Download,
          },
        ],
        canBeDeleted: true,
      },
    ];

    jest
      .spyOn(findingDocumentsListServiceMock, 'getFindingDocumentsList')
      .mockReturnValue(of(mockedFindingDocumentsList));
    jest
      .spyOn(profileStoreServiceMock, 'hasPermission')
      .mockReturnValue(() => false);

    // Act
    store.dispatch(new LoadFindingDocumentsList());

    const actualFindingDocumentsInState = store.selectSnapshot(
      (state) => state.findingDetails.documentsList,
    );

    // Assert
    expect(profileStoreServiceMock.hasPermission).toHaveBeenCalledWith(
      PermissionCategories.Findings,
      PermissionsList.Edit,
    );
    expect(actualFindingDocumentsInState).toEqual(
      expectedFindingDocumentsInState,
    );
  });

  test('should reset findings details state to default', () => {
    // Arrange
    const currentState: FindingDetailsStateModel = {
      findingDetails: {
        findingNumber: 'MANMES-0031',
        header: {
          acceptedDate: '18-05-2024',
          auditNumber: '3067486',
          auditType: 'CAT1 (major)',
          auditor: 'Auditor',
          city: 'Arnhem',
          closeDate: '18-05-2024',
          dueDate: '18-05-2024',
          openDate: '18-05-2024',
          site: 'DNV GL GSS IT',
          services: 'IFS Food version 8 April 2023 || FSC-STD-40-004 V3-1',
          status: 'Open',
        },
        primaryLanguageDescription: {
          category: 'CAT1 - Major',
          clause: 'Clause',
          description: 'Description',
          focusArea: 'Focus Area',
          language: 'English',
          isPrimaryLanguage: true,
          isSelected: false,
          title: 'Title',
        },
        secondaryLanguageDescription: {
          category: 'CAT1 - Major',
          clause: 'Clause',
          description: 'Description',
          focusArea: 'Focus Area',
          language: 'Norwegian',
          isPrimaryLanguage: false,
          isSelected: true,
          title: 'Title',
        },
      },
      latestFindingResponses: null,
      isRespondInProgress: false,
      isFindingResponseFormDirty: false,
      responseHistory: [],
      documentsList: [],
      gridConfig: {
        pagination: {
          paginationEnabled: true,
          pageSize: 10,
          startIndex: 0,
        },
        sorting: {
          mode: SortingMode.Multiple,
          rules: [],
        },
        filtering: {},
      },
      filterOptions: {},
    };

    store.reset(currentState);

    const expectedFindingDetailsState: FindingDetailsStateModel = {
      findingDetails: {
        findingNumber: '',
        header: {
          site: '',
          city: '',
          openDate: '',
          dueDate: '',
          closeDate: '',
          acceptedDate: '',
          auditor: '',
          auditType: '',
          auditNumber: '',
          services: '',
          status: '',
        },
        primaryLanguageDescription: {
          category: '',
          description: '',
          clause: '',
          focusArea: '',
          language: '',
          isPrimaryLanguage: false,
          isSelected: true,
          title: '',
        },
        secondaryLanguageDescription: {
          category: '',
          description: '',
          clause: '',
          focusArea: '',
          language: '',
          isPrimaryLanguage: false,
          isSelected: false,
          title: '',
        },
      },
      latestFindingResponses: null,
      responseHistory: [],
      isRespondInProgress: false,
      documentsList: [],
      gridConfig: DEFAULT_GRID_CONFIG,
      filterOptions: {},
      isFindingResponseFormDirty: false,
    };

    // Act
    store.dispatch(new ResetFindingDetailsState());

    const actualFindingDetailsInState = store.selectSnapshot(
      (state) => state.findingDetails,
    );

    // Assert
    expect(actualFindingDetailsInState).toEqual(expectedFindingDetailsState);
  });

  test('should load latest finding responses', () => {
    // Arrange
    const mockResponses: FindingResponsesDto = {
      isSuccess: true,
      data: {
        correctiveAction: 'Corrective Action',
        correction: 'Correction',
        rootCause: 'Root Cause',
        isSubmitToDnv: true,
        updatedOn: '2024-05-18T07:29:43.207+00:00',
        isDraft: false,
        respondId: 123,
      },
    };
    jest
      .spyOn(findingDetailsServiceMock, 'getLatestFindingResponses')
      .mockReturnValue(of(mockResponses));

    const expectedResponse = {
      formValue: {
        correctionAction: 'Corrective Action',
        nonConformity: 'Correction',
        rootCause: 'Root Cause',
      },
      isSubmit: true,
      createdOn: '18.05.2024',
      isDraft: false,
      respondId: '123',
    };

    // Act
    store.dispatch(new LoadLatestFindingResponses());

    const latestFindingResponses = store.selectSnapshot(
      (state) => state.findingDetails.latestFindingResponses,
    );

    // Assert
    expect(latestFindingResponses).toEqual(expectedResponse);
  });
});
