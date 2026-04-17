import {
  runInInjectionContext,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';

import { LoggingService, ServiceNowService } from '@customer-portal/core';
import {
  InvoiceListItemModel,
  InvoiceListStoreService,
} from '@customer-portal/data-access/financials';
import {
  createSettingsCoBrowsingStoreServiceMock,
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import { OverviewSharedStoreService } from '@customer-portal/overview-shared';
import { createPreferenceMockInjector } from '@customer-portal/preferences';
import {
  createTranslationServiceMock,
  EventAction,
  GridConfig,
  GridEventActionType,
  Language,
  ObjectName,
  ObjectType,
  PageName,
  SortingMode,
} from '@customer-portal/shared';

import { InvoiceEventService } from '../../services';
import { InvoiceListComponent } from './invoice-list.component';

describe('InvoiceListComponent', () => {
  let component: InvoiceListComponent;
  let invoiceListStoreServiceMock: Partial<InvoiceListStoreService>;
  const invoiceEventServiceMock: Partial<InvoiceEventService> = {
    updateReferenceNumber: jest.fn(),
    openUpdatePaymentDateModal: jest.fn(),
  };
  const overviewSharedStoreServiceMock: Partial<OverviewSharedStoreService> = {
    overviewFinancialStatus: signal([]),
  };
  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();
  const hasActiveFilters: WritableSignal<boolean> = signal(false);

  const mockServiceNowService: Partial<ServiceNowService> = {
    openInvoiceSupport: jest.fn(),
  };

  const mockMessageService: Partial<MessageService> = {
    add: jest.fn(),
  };

  const mockLoggingService: Partial<LoggingService> = {
    logException: jest.fn(),
  };

  const mockProfileLanguageStoreService: Partial<ProfileLanguageStoreService> =
    {
      languageLabel: (() => 'English' as Language) as Signal<Language>,
    };

  const testInvoices: InvoiceListItemModel[] = [
    {
      invoiceId: '462010019814',
      status: 'Overdue',
      amount: '1344.00 GBP',
      billingAddress: 'James Boulevard, London',
      dueDate: '2024-09-03T08:00:00Z',
      referenceNumber: '89465590',
      plannedPaymentDate: '2024-09-02T08:00:00Z',
      issueDate: '2024-09-01T08:00:00Z',
      contactPerson: 'Ryan Vaccaro',
      company: 'Opentech',
      originalInvoiceNumber: '',
      reportingCountry: 'GB',
      projectNumber: 'PRJC-515558-2014-MSC-GBR',
      actions: [],
      eventActions: {} as EventAction,
    },
    {
      invoiceId: '462010019815',
      status: 'Not Paid',
      amount: '1344.00 GBP',
      billingAddress: 'James Boulevard, London',
      dueDate: '2024-09-03T08:00:00Z',
      referenceNumber: '89465590',
      plannedPaymentDate: '2024-09-02T08:00:00Z',
      issueDate: '2024-09-01T08:00:00Z',
      contactPerson: 'Ryan Vaccaro',
      company: 'Opentech',
      originalInvoiceNumber: '',
      reportingCountry: 'GB',
      projectNumber: 'PRJC-515558-2014-MSC-GBR',
      actions: [],
      eventActions: {} as EventAction,
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    const injector = createPreferenceMockInjector();
    invoiceListStoreServiceMock = {
      loadInvoiceList: jest.fn(),
      updateGridConfig: jest.fn(),
      resetInvoiceListState: jest.fn(),
      applyNavigationFilters: jest.fn(),
      hasActiveFilters,
      invoices: signal<InvoiceListItemModel[]>([]),
    };

    runInInjectionContext(injector, () => {
      component = new InvoiceListComponent(
        invoiceListStoreServiceMock as InvoiceListStoreService,
        settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
        invoiceEventServiceMock as InvoiceEventService,
        overviewSharedStoreServiceMock as OverviewSharedStoreService,
        createTranslationServiceMock() as TranslocoService,
        mockServiceNowService as ServiceNowService,
        mockMessageService as MessageService,
        mockLoggingService as LoggingService,
        mockProfileLanguageStoreService as ProfileLanguageStoreService,
      );
    });
  });

  test('should initialize preferences', () => {
    // Assert
    expect(
      (component as any).preferenceStoreService.loadPreference,
    ).toHaveBeenCalledWith(
      PageName.FinancialList,
      ObjectName.Financials,
      ObjectType.Grid,
    );
  });

  test('should save preferences', () => {
    // Arrange
    const data = { data: 'data' };

    // Act
    component.onSavePreference(data);

    // Assert
    expect(
      (component as any).preferenceStoreService.savePreference,
    ).toHaveBeenCalledWith({
      data,
      pageName: PageName.FinancialList,
      objectName: ObjectName.Financials,
      objectType: ObjectType.Grid,
    });
  });

  test('should update grid config when grid config changed', () => {
    // Arrange
    const gridConfig: GridConfig = {
      filtering: {},
      pagination: {
        paginationEnabled: true,
        pageSize: 10,
        startIndex: 1,
      },
      sorting: {
        mode: SortingMode.Multiple,
        rules: [],
      },
    };

    // Act
    component.onGridConfigChanged(gridConfig);

    // Assert
    expect(invoiceListStoreServiceMock.updateGridConfig).toHaveBeenCalledWith(
      gridConfig,
    );
  });

  test('should reset invoices list state on destroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(
      invoiceListStoreServiceMock.resetInvoiceListState,
    ).toHaveBeenCalled();
  });

  describe('triggerEventAction', () => {
    test('should call updateReferenceNumber when actionType is UpdateReferenceNumber', () => {
      // Arrange
      const mockEvent = {
        event: {
          id: '1',
          actionType: GridEventActionType.UpdateReferenceNumber,
        },
      };

      // Act
      component.onTriggerEventAction(mockEvent);

      // Assert
      expect(
        invoiceEventServiceMock.updateReferenceNumber,
      ).toHaveBeenCalledWith('1');
    });

    test('should call openUpdatePaymentDateModal with [id] when actionType is UpdatePlannedPaymentDate', () => {
      // Arrange
      const mockEvent = {
        event: {
          id: '2',
          actionType: GridEventActionType.UpdatePlannedPaymentDate,
        },
      };

      // Act
      component.onTriggerEventAction(mockEvent);

      // Assert
      expect(
        invoiceEventServiceMock.openUpdatePaymentDateModal,
      ).toHaveBeenCalledWith(['2']);
    });
  });

  describe('onSelectionChangeData', () => {
    test('should set displayDownloadButton to true when selectedInvoices is not empty', () => {
      // Arrange
      const selectedInvoices: InvoiceListItemModel[] = testInvoices;

      // Act
      component.onSelectionChangeData(selectedInvoices);

      // Assert
      expect(component.displayDownloadButton).toBe(true);
    });

    test('should set selectedOverdueOrUnpaidIds to contain only ids for invoices that are Overdue or Not Paid', () => {
      // Arrange
      const selectedInvoices: InvoiceListItemModel[] = testInvoices;

      // Act
      component.onSelectionChangeData(selectedInvoices);

      // Assert
      expect((component as any).selectedOverdueOrUnpaidIds).toEqual([
        '462010019814',
        '462010019815',
      ]);
    });

    test('should set selectedOverdueOrUnpaidIds to empty array if selected do not contain invoices that are not either overdue or not paid', () => {
      // Arrange
      const selectedInvoices: InvoiceListItemModel[] = [
        { ...testInvoices[0], status: 'Cancelled' },
        { ...testInvoices[0], status: 'Paid' },
      ];

      // Act
      component.onSelectionChangeData(selectedInvoices);

      // Assert
      expect((component as any).selectedOverdueOrUnpaidIds).toEqual([]);
    });

    test('should set displayDownloadButton to false when selectedInvoices is empty', () => {
      // Arrange
      const selectedInvoices: InvoiceListItemModel[] = [];

      // Act
      component.onSelectionChangeData(selectedInvoices);

      // Assert
      expect(component.displayDownloadButton).toBe(false);
      expect((component as any).selectedOverdueOrUnpaidIds).toEqual([]);
    });

    test('should set displayUpdatePlannedPaymentDateButton to true when selectedInvoices is not empty and user is not dnvUser', () => {
      // Arrange
      const selectedInvoices: InvoiceListItemModel[] = testInvoices;

      // Act
      component.onSelectionChangeData(selectedInvoices);

      // Assert
      expect(component.displayUpdatePlannedPaymentDateButton).toBe(true);
    });

    test('should set displayUpdatePlannedPaymentDateButton to false when selectedInvoices is empty and user is not dnvUser', () => {
      // Arrange
      const selectedInvoices: InvoiceListItemModel[] = testInvoices;

      // Act
      component.onSelectionChangeData(selectedInvoices);

      // Assert
      expect(component.displayUpdatePlannedPaymentDateButton).toBe(true);
    });
  });

  describe('updateMultiplePlannedPaymentDate', () => {
    test('should call openUpdatePaymentDateModal with selectedOverdueOrUnpaidIds', () => {
      // Arrange
      (component as any).selectedOverdueOrUnpaidIds = ['1', '2', '3'];

      // Act
      component.updateMultiplePlannedPaymentDate();

      // Assert
      expect(
        invoiceEventServiceMock.openUpdatePaymentDateModal,
      ).toHaveBeenCalledWith(['1', '2', '3']);
    });
  });
});
