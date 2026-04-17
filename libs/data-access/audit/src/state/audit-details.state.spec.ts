import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import {
  createProfileStoreServiceMock,
  createSettingsCoBrowsingStoreServiceMock,
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
  DEFAULT_GRID_CONFIG,
  FilteringConfig,
  FilterMode,
  FilterOperator,
  GridConfig,
  GridFileActionType,
  SortingMode,
} from '@customer-portal/shared';

import {
  AuditDetailsDto,
  AuditDocumentsListDto,
  AuditFindingListDto,
  AuditFindingsExcelPayloadDto,
  SitesListDto,
  SubAuditExcelPayloadDto,
  SubAuditListDto,
} from '../dtos';
import { AuditDocumentListItemModel } from '../models';
import { AuditDetailsService, AuditDocumentsListService } from '../services';
import {
  ExportAuditFindingsExcel,
  ExportSubAuditsExcel,
  LoadAuditDetails,
  LoadAuditDocumentsList,
  LoadAuditFindingsList,
  LoadAuditSitesList,
  LoadSubAuditList,
  ResetAuditDetailsState,
  UpdateAuditDocumentsListGridConfig,
  UpdateAuditFindingListGridConfig,
  UpdateAuditSitesListGridConfig,
  UpdateSubAuditListGridConfig,
} from './actions';
import {
  AuditDetailsState,
  AuditDetailsStateModel,
} from './audit-details.state';

describe('AuditDetailsState', () => {
  let store: Store;
  let originalLocale: string;

  const auditDetailsServiceMock = {
    getAuditFindingList: jest.fn(),
    getSubAuditList: jest.fn(),
    getAuditDetails: jest.fn(),
    getSitesList: jest.fn(),
    exportAuditFindingsExcel: jest.fn(() => of()),
    exportSubAuditsExcel: jest.fn(() => of()),
  };

  const auditDocumentsListServiceMock = {
    getAuditDocumentsList: jest.fn(),
  };

  const messageServiceMock = {
    add: jest.fn(),
  };

  const profileStoreServiceMock = createProfileStoreServiceMock();

  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AuditDetailsState])],
      providers: [
        {
          provide: AuditDetailsService,
          useValue: auditDetailsServiceMock,
        },
        {
          provide: AuditDocumentsListService,
          useValue: auditDocumentsListServiceMock,
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
          provide: MessageService,
          useValue: messageServiceMock,
        },
      ],
    });

    store = TestBed.inject(Store);
  });

  beforeAll(() => {
    // Save the original locale
    originalLocale = Intl.DateTimeFormat().resolvedOptions().locale;

    // Mock the locale to 'en-US'
    Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
      value: () => ({ locale: 'en-US' }),
    });
  });

  afterAll(() => {
    // Restore the original locale
    Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
      value: () => ({ locale: originalLocale }),
    });
  });

  test('should load and transform audit findings into state', () => {
    // Arrange
    const mockedAuditFindingsListResponse: AuditFindingListDto = {
      data: [
        {
          findingsId: '123',
          findingNumber: 'MANMES-0031',
          category: 'Incident',
          companyName: 'company1',
          status: 'Open',
          title: 'Major security vulnerability found',
          services: ['OWASP Top 10', 'NIST 800-53'],
          sites: ['Site 1', 'Site 2'],
          cities: ['San Francisco', 'Bucharest'],
          auditId: '2024001',
          openDate: '2024-06-15T08:00:00Z',
          dueDate: '2024-06-30T08:00:00Z',
          closedDate: '2024-07-05T08:00:00Z',
          acceptedDate: '2024-07-10T08:00:00Z',
        },
        {
          findingsId: '456',
          findingNumber: 'MANMES-0032',
          category: 'Contravention',
          companyName: 'company2',
          status: 'Closed',
          title: 'Process improvement needed',
          services: ['ISO 9001:2015', 'Six Sigma'],
          sites: ['Site 3', 'Site 4'],
          cities: ['Detroit', 'Toronto'],
          auditId: '2024002',
          openDate: '2024-07-01T08:00:00Z',
          dueDate: '2024-07-15T08:00:00Z',
          closedDate: '2024-07-20T08:00:00Z',
          acceptedDate: '2024-07-25T08:00:00Z',
        },
      ],
    };
    jest
      .spyOn(auditDetailsServiceMock, 'getAuditFindingList')
      .mockReturnValue(of(mockedAuditFindingsListResponse));
    const expectedAuditFindingsInState = [
      {
        findingNumber: 'MANMES-0031',
        status: 'Open',
        title: 'Major security vulnerability found',
        category: 'Incident',
        companyName: 'company1',
        services: 'OWASP Top 10 || NIST 800-53',
        site: 'Site 1 || Site 2',
        city: 'San Francisco || Bucharest',
        auditNumber: '2024001',
        openDate: '15.06.2024',
        dueDate: '30.06.2024',
        closeDate: '05.07.2024',
        acceptedDate: '10.07.2024',
      },
      {
        findingNumber: 'MANMES-0032',
        status: 'Closed',
        title: 'Process improvement needed',
        category: 'Contravention',
        companyName: 'company2',
        services: 'ISO 9001:2015 || Six Sigma',
        site: 'Site 3 || Site 4',
        city: 'Detroit || Toronto',
        auditNumber: '2024002',
        openDate: '01.07.2024',
        dueDate: '15.07.2024',
        closeDate: '20.07.2024',
        acceptedDate: '25.07.2024',
      },
    ];

    // Act
    store.dispatch(new LoadAuditFindingsList());

    const actualAuditFindingsInState = store.selectSnapshot(
      (state) => state.auditDetails.auditFindingItems,
    );

    // Assert
    expect(actualAuditFindingsInState).toEqual(expectedAuditFindingsInState);
  });

  test('should load and transform sub audit list into state', () => {
    // Arrange
    const mockedSubAuditListResponse: SubAuditListDto = {
      data: [
        {
          auditId: 1,
          status: 'In Progress',
          services: ['Service 1'],
          sites: ['Site 1'],
          cities: ['City 1'],
          startDate: '2017-01-20T00:00:00.000+00:00',
          endDate: '2017-01-20T00:00:00.000+00:00',
          auditorTeam: ['Auditor 1', 'Auditor 2'],
        },
        {
          auditId: 2,
          status: 'Completed',
          services: ['Service 2'],
          sites: ['Site 2'],
          cities: ['City 2'],
          startDate: '2017-01-20T00:00:00.000+00:00',
          endDate: '2017-01-20T00:00:00.000+00:00',
          auditorTeam: ['Auditor 3', 'Auditor 4'],
        },
      ],
    };
    jest
      .spyOn(auditDetailsServiceMock, 'getSubAuditList')
      .mockReturnValue(of(mockedSubAuditListResponse));
    const expectedSubAuditItemsInState = [
      {
        auditNumber: '1',
        status: 'In Progress',
        service: 'Service 1',
        site: 'Site 1',
        city: 'City 1',
        auditorTeam: 'Auditor 1 || Auditor 2',
        startDate: '20-01-2017',
        endDate: '20-01-2017',
      },
      {
        auditNumber: '2',
        status: 'Completed',
        service: 'Service 2',
        site: 'Site 2',
        city: 'City 2',
        auditorTeam: 'Auditor 3 || Auditor 4',
        startDate: '20-01-2017',
        endDate: '20-01-2017',
      },
    ];

    // Act
    store.dispatch(new LoadSubAuditList());

    const actualSubAuditItemsInState = store.selectSnapshot(
      (state) => state.auditDetails.subAuditItems,
    );

    // Assert
    expect(actualSubAuditItemsInState).toEqual(expectedSubAuditItemsInState);
  });

  test('should load and transform audit details into state', () => {
    // Arrange
    const mockedAuditDetailsResponse: AuditDetailsDto = {
      isSuccess: true,
      data: {
        auditId: 1,
        status: 'Open',
        siteName: 'Site 1',
        siteAddress: 'Address 1',
        startDate: '2021-01-01T00:00:00Z',
        endDate: '2021-02-01T00:00:00Z',
        leadAuditor: 'Auditor 1',
        auditorTeam: ['John Doe'],
        services: ['Service 1'],
      },
    };

    const mockedReportsDto: AuditDocumentsListDto = {
      data: [
        {
          documentId: 1,
          fileName: 'L2C DCM User Guide.docx',
          type: 'Audit Plan',
          dateAdded: '2024-07-04T14:45:38',
          uploadedBy: 'John',
          canBeDeleted: false,
          currentSecurity: '10',
        },
        {
          documentId: 2,
          fileName: 'Designing_Data_Intensive_Applications_890.pdf',
          type: 'Audit Report',
          dateAdded: '2024-07-18T15:25:19',
          uploadedBy: 'Doe',
          canBeDeleted: false,
          currentSecurity: '10',
        },
      ],
      isSuccess: true,
      message: '',
    };

    jest
      .spyOn(auditDetailsServiceMock, 'getAuditDetails')
      .mockReturnValue(of(mockedAuditDetailsResponse));
    jest
      .spyOn(auditDocumentsListServiceMock, 'getAuditDocumentsList')
      .mockReturnValue(of(mockedReportsDto));

    const expectedAuditDetailsInState = {
      auditNumber: 1,
      header: {
        status: 'Open',
        siteName: 'Site 1',
        siteAddress: 'Address 1',
        startDate: '01.01.2021',
        endDate: '01.02.2021',
        auditor: 'Auditor 1',
        auditorTeam: ['John Doe'],
        services: 'Service 1',
        auditPlanDocId: [1],
        auditReportDocId: [2],
      },
    };

    // Act
    store.dispatch(new LoadAuditDetails());

    const actualAuditDetailsInState = store.selectSnapshot(
      (state) => state.auditDetails.auditDetails,
    );

    // Assert
    expect(actualAuditDetailsInState).toEqual(expectedAuditDetailsInState);
  });

  test('should load and transform audit sites list into state', () => {
    // Arrange
    const mockedSitesListResponse: SitesListDto = {
      data: [
        {
          siteName: 'N1',
          addressLine: 'Address1',
          city: 'City1',
          country: 'Country1',
          postCode: '1234',
        },
      ],
    };
    jest
      .spyOn(auditDetailsServiceMock, 'getSitesList')
      .mockReturnValue(of(mockedSitesListResponse));
    const expectedSitesListItems = [
      {
        siteName: 'N1',
        siteAddress: 'Address1',
        city: 'City1',
        country: 'Country1',
        postcode: '1234',
      },
    ];

    // Act
    store.dispatch(new LoadAuditSitesList());

    const actualSitesListItems = store.selectSnapshot(
      (state) => state.auditDetails.siteItems,
    );

    // Assert
    expect(actualSitesListItems).toEqual(expectedSitesListItems);
  });

  test('should request audit documents, save transformed result into the state and fill auditDocumentsList in state when audits edit permission is true', () => {
    // Arrange
    const mockedAuditDocumentsList: AuditDocumentsListDto = {
      data: [
        {
          documentId: 139226932,
          fileName: 'LargeFile_8.docx',
          type: 'Audit Plan',
          dateAdded: '2024-07-05T14:03:05',
          uploadedBy: 'Thomas Harding',
          canBeDeleted: true,
          currentSecurity: '10',
        },
        {
          documentId: 139227057,
          fileName: 'LargeFile_5.docx',
          type: 'Audit Plan',
          dateAdded: '2024-07-05T08:55:40',
          uploadedBy: 'John Smith',
          canBeDeleted: true,
          currentSecurity: '10',
        },
        {
          documentId: 139227059,
          fileName: 'Ramram_14.txt',
          type: 'Audit Plan',
          dateAdded: '2024-07-05T14:09:03',
          uploadedBy: 'Bill Gas',
          canBeDeleted: true,
          currentSecurity: '10',
        },
        {
          documentId: 139227060,
          fileName: 'test_file_example_XLS_5000_deletable.xlsx',
          type: 'Evidence',
          dateAdded: '2024-07-05T18:09:39',
          uploadedBy: 'Bill Gas',
          canBeDeleted: true,
          currentSecurity: '10',
        },
        {
          documentId: 139227182,
          fileName: 'PAF PAP-Matrix.txt',
          type: 'Evidence',
          dateAdded: '2024-07-05T18:32:54',
          uploadedBy: 'Thomas Harding',
          canBeDeleted: true,
          currentSecurity: '10',
        },
      ],
      isSuccess: true,
      message: '',
    };

    const expectedAuditDocumentsInState: AuditDocumentListItemModel[] = [
      {
        documentId: 139226932,
        fileName: 'LargeFile_8.docx',
        fileType: 'Audit Plan',
        dateAdded: '05.07.2024',
        uploadedBy: 'Thomas Harding',
        canBeDeleted: true,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            actionType: GridFileActionType.Download,
          },
          {
            label: 'delete',
            iconClass: 'pi-trash',
            actionType: GridFileActionType.Delete,
          },
        ],
      },
      {
        documentId: 139227057,
        fileName: 'LargeFile_5.docx',
        fileType: 'Audit Plan',
        dateAdded: '05.07.2024',
        uploadedBy: 'John Smith',
        canBeDeleted: true,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            actionType: GridFileActionType.Download,
          },
          {
            label: 'delete',
            iconClass: 'pi-trash',
            actionType: GridFileActionType.Delete,
          },
        ],
      },
      {
        documentId: 139227059,
        fileName: 'Ramram_14.txt',
        fileType: 'Audit Plan',
        dateAdded: '05.07.2024',
        uploadedBy: 'Bill Gas',
        canBeDeleted: true,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            actionType: GridFileActionType.Download,
          },
          {
            label: 'delete',
            iconClass: 'pi-trash',
            actionType: GridFileActionType.Delete,
          },
        ],
      },
      {
        documentId: 139227060,
        fileName: 'test_file_example_XLS_5000_deletable.xlsx',
        fileType: 'Evidence',
        dateAdded: '05.07.2024',
        uploadedBy: 'Bill Gas',
        canBeDeleted: true,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            actionType: GridFileActionType.Download,
          },
          {
            label: 'delete',
            iconClass: 'pi-trash',
            actionType: GridFileActionType.Delete,
          },
        ],
      },
      {
        documentId: 139227182,
        fileName: 'PAF PAP-Matrix.txt',
        fileType: 'Evidence',
        dateAdded: '05.07.2024',
        uploadedBy: 'Thomas Harding',
        canBeDeleted: true,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            actionType: GridFileActionType.Download,
          },
          {
            label: 'delete',
            iconClass: 'pi-trash',
            actionType: GridFileActionType.Delete,
          },
        ],
      },
    ];

    jest
      .spyOn(auditDocumentsListServiceMock, 'getAuditDocumentsList')
      .mockReturnValue(of(mockedAuditDocumentsList));
    jest
      .spyOn(profileStoreServiceMock, 'hasPermission')
      .mockReturnValue(() => true);

    // Act
    store.dispatch(new LoadAuditDocumentsList());

    const actualFindingDocumentsInState = store.selectSnapshot(
      (state) => state.auditDetails.auditDocumentsList,
    );

    // Assert
    expect(profileStoreServiceMock.hasPermission).toHaveBeenCalledWith(
      PermissionCategories.Audits,
      PermissionsList.Edit,
    );
    expect(actualFindingDocumentsInState).toEqual(
      expectedAuditDocumentsInState,
    );
  });

  test('should request audit documents, save transformed result into the state and fill auditDocumentsList in state when audits edit permission is false', () => {
    // Arrange
    const mockedAuditDocumentsList: AuditDocumentsListDto = {
      data: [
        {
          documentId: 139226932,
          fileName: 'LargeFile_8.docx',
          type: 'Audit Plan',
          dateAdded: '2024-07-05T14:03:05',
          uploadedBy: 'Thomas Harding',
          canBeDeleted: true,
          currentSecurity: '10',
        },
        {
          documentId: 139227057,
          fileName: 'LargeFile_5.docx',
          type: 'Audit Plan',
          dateAdded: '2024-07-05T08:55:40',
          uploadedBy: 'John Smith',
          canBeDeleted: true,
          currentSecurity: '10',
        },
        {
          documentId: 139227059,
          fileName: 'Ramram_14.txt',
          type: 'Audit Plan',
          dateAdded: '2024-07-05T14:09:03',
          uploadedBy: 'Bill Gas',
          canBeDeleted: true,
          currentSecurity: '10',
        },
        {
          documentId: 139227060,
          fileName: 'test_file_example_XLS_5000_deletable.xlsx',
          type: 'Evidence',
          dateAdded: '2024-07-05T18:09:39',
          uploadedBy: 'Bill Gas',
          canBeDeleted: true,
          currentSecurity: '10',
        },
        {
          documentId: 139227182,
          fileName: 'PAF PAP-Matrix.txt',
          type: 'Evidence',
          dateAdded: '2024-07-05T18:32:54',
          uploadedBy: 'Thomas Harding',
          canBeDeleted: true,
          currentSecurity: '10',
        },
      ],
      isSuccess: true,
      message: '',
    };

    const expectedAuditDocumentsInState: AuditDocumentListItemModel[] = [
      {
        documentId: 139226932,
        fileName: 'LargeFile_8.docx',
        fileType: 'Audit Plan',
        dateAdded: '05.07.2024',
        uploadedBy: 'Thomas Harding',
        canBeDeleted: true,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            actionType: GridFileActionType.Download,
          },
        ],
      },
      {
        documentId: 139227057,
        fileName: 'LargeFile_5.docx',
        fileType: 'Audit Plan',
        dateAdded: '05.07.2024',
        uploadedBy: 'John Smith',
        canBeDeleted: true,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            actionType: GridFileActionType.Download,
          },
        ],
      },
      {
        documentId: 139227059,
        fileName: 'Ramram_14.txt',
        fileType: 'Audit Plan',
        dateAdded: '05.07.2024',
        uploadedBy: 'Bill Gas',
        canBeDeleted: true,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            actionType: GridFileActionType.Download,
          },
        ],
      },
      {
        documentId: 139227060,
        fileName: 'test_file_example_XLS_5000_deletable.xlsx',
        fileType: 'Evidence',
        dateAdded: '05.07.2024',
        uploadedBy: 'Bill Gas',
        canBeDeleted: true,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            actionType: GridFileActionType.Download,
          },
        ],
      },
      {
        documentId: 139227182,
        fileName: 'PAF PAP-Matrix.txt',
        fileType: 'Evidence',
        dateAdded: '05.07.2024',
        uploadedBy: 'Thomas Harding',
        canBeDeleted: true,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            actionType: GridFileActionType.Download,
          },
        ],
      },
    ];

    jest
      .spyOn(auditDocumentsListServiceMock, 'getAuditDocumentsList')
      .mockReturnValue(of(mockedAuditDocumentsList));
    jest
      .spyOn(profileStoreServiceMock, 'hasPermission')
      .mockReturnValue(() => false);

    // Act
    store.dispatch(new LoadAuditDocumentsList());

    const actualFindingDocumentsInState = store.selectSnapshot(
      (state) => state.auditDetails.auditDocumentsList,
    );

    // Assert
    expect(profileStoreServiceMock.hasPermission).toHaveBeenCalledWith(
      PermissionCategories.Audits,
      PermissionsList.Edit,
    );
    expect(actualFindingDocumentsInState).toEqual(
      expectedAuditDocumentsInState,
    );
  });

  test('should reset audit details state to default', () => {
    // Arrange
    const currentState: AuditDetailsStateModel = {
      auditId: '123',
      auditDetails: {
        auditNumber: 1,
        header: {
          status: 'Open',
          siteName: 'Site 1',
          siteAddress: 'Address 1',
          startDate: '01.01.2021',
          endDate: '01.02.2021',
          auditor: 'Auditor 1',
          auditorTeam: ['John Doe'],
          services: 'Service 1',
          auditPlanDocId: [123],
          auditReportDocId: [234],
        },
      },
      subAuditGridConfig: {
        pagination: {
          paginationEnabled: true,
          pageSize: 50,
          startIndex: 0,
        },
        sorting: {
          mode: SortingMode.Multiple,
          rules: [],
        },
        filtering: {},
      },
      subAuditFilterOptions: {},
      auditFindingItems: [
        {
          findingNumber: 'MANMES-0031',
          status: 'Open',
          title: 'Major security vulnerability found',
          category: 'Security',
          services: 'OWASP Top 10 || NIST 800-53',
          companyName: 'company1',
          site: 'TechCo HQ',
          city: 'San Francisco',
          auditNumber: '2024001',
          openDate: '15-06-2024',
          dueDate: '30-06-2024',
          closeDate: '05-07-2024',
          acceptedDate: '10-07-2024',
        },
        {
          findingNumber: 'MANMES-0032',
          status: 'Closed',
          title: 'Process improvement needed',
          category: 'Quality',
          companyName: 'company2',
          services: 'ISO 9001:2015 || Six Sigma',
          site: 'Production Facility',
          city: 'Detroit',
          auditNumber: '2024002',
          openDate: '01-07-2024',
          dueDate: '15-07-2024',
          closeDate: '20-07-2024',
          acceptedDate: '25-07-2024',
        },
      ],
      auditFindingGridConfig: {
        pagination: {
          paginationEnabled: true,
          pageSize: 50,
          startIndex: 0,
        },
        sorting: {
          mode: SortingMode.Multiple,
          rules: [],
        },
        filtering: {},
      },
      auditFindingFilterOptions: {},
      subAuditItems: [
        {
          auditNumber: '1',
          status: 'In Progress',
          service: 'Service 1',
          site: 'Site 1',
          city: 'City 1',
          auditorTeam: 'Auditor 1 || Auditor 2',
          startDate: '20-01-2017',
          endDate: '20-01-2017',
        },
        {
          auditNumber: '2',
          status: 'Completed',
          service: 'Service 2',
          site: 'Site 2',
          city: 'City 2',
          auditorTeam: 'Auditor 3 || Auditor 4',
          startDate: '20-01-2017',
          endDate: '20-01-2017',
        },
      ],
      siteItems: [],
      siteItemsGridConfig: {
        pagination: {
          paginationEnabled: true,
          pageSize: 50,
          startIndex: 0,
        },
        sorting: {
          mode: SortingMode.Multiple,
          rules: [],
        },
        filtering: {},
      },
      siteItemsFilterOptions: {},
      auditDocumentsList: [
        {
          documentId: 139226932,
          fileName: 'LargeFile_8.docx',
          fileType: 'Audit Plan',
          dateAdded: '2024-07-05T14:03:05',
          uploadedBy: 'Thomas Harding',
          canBeDeleted: true,
          actions: [],
        },
        {
          documentId: 139227057,
          fileName: 'LargeFile_5.docx',
          fileType: 'Audit Plan',
          dateAdded: '2024-07-05T08:55:40',
          uploadedBy: 'John Smith',
          canBeDeleted: true,
          actions: [],
        },
      ],
      auditDocumentsGridConfig: {
        pagination: {
          paginationEnabled: true,
          pageSize: 50,
          startIndex: 0,
        },
        sorting: {
          mode: SortingMode.Multiple,
          rules: [],
        },
        filtering: {},
      },
      auditDocumentsFilterOptions: {},
    };

    store.reset(currentState);

    const expectedAuditDetailsState = {
      auditId: '',
      auditDetails: {
        auditNumber: 0,
        header: {
          status: '',
          services: '',
          siteName: '',
          siteAddress: '',
          startDate: '',
          endDate: '',
          auditor: '',
          auditorTeam: [],
          auditPlanDocId: [],
          auditReportDocId: [],
        },
      },
      subAuditGridConfig: DEFAULT_GRID_CONFIG,
      subAuditFilterOptions: {},
      auditFindingItems: [],
      auditFindingGridConfig: DEFAULT_GRID_CONFIG,
      auditFindingFilterOptions: {},
      subAuditItems: [],
      siteItems: [],
      siteItemsGridConfig: DEFAULT_GRID_CONFIG,
      siteItemsFilterOptions: {},
      auditDocumentsList: [],
      auditDocumentsGridConfig: DEFAULT_GRID_CONFIG,
      auditDocumentsFilterOptions: {},
    };

    // Act
    store.dispatch(new ResetAuditDetailsState());

    const actualAuditDetailsInState = store.selectSnapshot(
      (state) => state.auditDetails,
    );

    // Assert
    expect(actualAuditDetailsInState).toEqual(expectedAuditDetailsState);
  });

  test('should request download audit findings excel based on user filters', () => {
    // Arrange
    const userFilters: FilteringConfig = {
      status: {
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
        value: [
          {
            label: 'Closed',
            value: 'Closed',
          },
        ],
      },
      category: {
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
        value: [
          {
            label: 'Observation',
            value: 'Observation',
          },
        ],
      },
    };
    const auditId = 123;
    store.reset({
      auditDetails: {
        auditId,
        auditFindingGridConfig: {
          filtering: userFilters,
        },
      },
    });
    const expectedPayload: AuditFindingsExcelPayloadDto = {
      filters: {
        findings: null,
        audit: null,
        auditId: [auditId],
        status: ['Closed'],
        title: null,
        category: ['Observation'],
        companyName: null,
        service: null,
        city: null,
        site: null,
        openDate: null,
        dueDate: null,
        acceptedDate: null,
        closeDate: null,
      },
    };

    // Act
    store.dispatch(new ExportAuditFindingsExcel());

    // Assert
    expect(
      auditDetailsServiceMock.exportAuditFindingsExcel,
    ).toHaveBeenCalledWith(expectedPayload);
  });

  test('should request download sub audits excel based on user filters', () => {
    // Arrange
    const userFilters: FilteringConfig = {
      service: {
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
        value: [
          {
            label: 'ISO 14001:2015',
            value: 'ISO 14001:2015',
          },
          {
            label: 'ISO 45001:2018',
            value: 'ISO 45001:2018',
          },
        ],
      },
      site: {
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
        value: [
          {
            label: 'ISS Facility Services',
            value: 'ISS Facility Services',
          },
        ],
      },
    };
    const auditId = 123;
    store.reset({
      auditDetails: {
        auditId,
        subAuditGridConfig: {
          filtering: userFilters,
        },
      },
    });
    const expectedPayload: SubAuditExcelPayloadDto = {
      auditId,
      filters: {
        status: [],
        service: ['ISO 14001:2015', 'ISO 45001:2018'],
        sites: ['ISS Facility Services'],
        city: [],
        startDate: [],
        endDate: [],
        auditorTeam: [],
      },
    };

    // Act
    store.dispatch(new ExportSubAuditsExcel());

    // Assert
    expect(auditDetailsServiceMock.exportSubAuditsExcel).toHaveBeenCalledWith(
      expectedPayload,
    );
  });

  test('should update audit finding list grid config into the state', () => {
    // Arrange
    const auditFindingGridConfig: GridConfig = {
      filtering: {},
      sorting: { mode: SortingMode.Multiple, rules: [] },
      pagination: {
        paginationEnabled: true,
        pageSize: 10,
        startIndex: 0,
      },
    };

    // Act
    store.dispatch(
      new UpdateAuditFindingListGridConfig(auditFindingGridConfig),
    );
    const actualGridConfig = store.selectSnapshot(
      (state) => state.auditDetails.auditFindingGridConfig,
    );

    // Assert
    expect(actualGridConfig).toEqual(auditFindingGridConfig);
  });

  test('should update subAudit list grid config into the state', () => {
    // Arrange
    const gridConfig: GridConfig = {
      filtering: {},
      sorting: { mode: SortingMode.Multiple, rules: [] },
      pagination: {
        paginationEnabled: true,
        pageSize: 10,
        startIndex: 0,
      },
    };

    // Act
    store.dispatch(new UpdateSubAuditListGridConfig(gridConfig));
    const actualGridConfig = store.selectSnapshot(
      (state) => state.auditDetails.subAuditGridConfig,
    );

    // Assert
    expect(actualGridConfig).toEqual(gridConfig);
  });

  test('should update audit sites list grid config into the state', () => {
    // Arrange
    const gridConfig: GridConfig = {
      filtering: {},
      sorting: { mode: SortingMode.Multiple, rules: [] },
      pagination: {
        paginationEnabled: true,
        pageSize: 10,
        startIndex: 0,
      },
    };

    // Act
    store.dispatch(new UpdateAuditSitesListGridConfig(gridConfig));
    const actualGridConfig = store.selectSnapshot(
      (state) => state.auditDetails.siteItemsGridConfig,
    );

    // Assert
    expect(actualGridConfig).toEqual(gridConfig);
  });

  test('should update audit documents list grid config into the state', () => {
    // Arrange
    const gridConfig: GridConfig = {
      filtering: {},
      sorting: { mode: SortingMode.Multiple, rules: [] },
      pagination: {
        paginationEnabled: true,
        pageSize: 10,
        startIndex: 0,
      },
    };

    // Act
    store.dispatch(new UpdateAuditDocumentsListGridConfig(gridConfig));
    const actualGridConfig = store.selectSnapshot(
      (state) => state.auditDetails.auditDocumentsGridConfig,
    );

    // Assert
    expect(actualGridConfig).toEqual(gridConfig);
  });
});
