import {
  FilteringConfig,
  FilterMode,
  FilterOperator,
} from '@customer-portal/shared';

import { ScheduleStatus } from '../../constants';
import { ScheduleExcelPayloadDto, ScheduleListDto } from '../../dtos';
import { ScheduleListItemModel } from '../../models';
import { ScheduleListMapperService } from './schedule-list-mapper.service';

const baseDtoItem = {
  siteAuditId: 1,
  startDate: '2024-08-12T10:00:00Z',
  endDate: '2024-08-12T12:00:00Z',
  status: ScheduleStatus.ToBeConfirmed,
  services: ['Service A'],
  site: 'Site A',
  city: 'City A',
  auditType: 'Audit A',
  leadAuditor: 'Auditor A',
  siteRepresentatives: ['Rep A'],
  company: 'Company A',
  siteAddress: 'Peliyagoda Warehouse Complex',
  auditID: 2420775,
  siteZip: 140456,
  siteCountry: 'Sri Lanka',
  siteState: '',
  reportingCountry: 'LK',
  projectNumber: 'PRJC-73422-2008-MSC-LKA',
};

const baseExpectedItem: ScheduleListItemModel = {
  scheduleId: 1,
  siteAuditId: 1,
  startDate: '12-08-2024',
  endDate: '12-08-2024',
  status: ScheduleStatus.ToBeConfirmed,
  service: 'Service A',
  site: 'Site A',
  city: 'City A',
  auditType: 'Audit A',
  leadAuditor: 'Auditor A',
  siteRepresentative: 'Rep A',
  company: 'Company A',
  siteAddress: 'Peliyagoda Warehouse Complex',
  auditID: 2420775,
  siteZip: 140456,
  siteCountry: 'Sri Lanka',
  siteState: '',
  reportingCountry: 'LK',
  projectNumber: 'PRJC-73422-2008-MSC-LKA',
  eventActions: {
    id: 1,
    displayConfirmButton: false,
    displayConfirmedLabel: false,
    actions: [
      {
        label: 'reschedule',
        i18nKey: 'gridEvent.reschedule',
        icon: 'pi pi-calendar',
        disabled: true,
      },
      {
        label: 'shareInvite',
        i18nKey: 'gridEvent.shareInvite',
        icon: 'pi pi-share-alt',
        disabled: true,
      },
      {
        label: 'addToCalendar',
        i18nKey: 'gridEvent.addToCalendar',
        icon: 'pi pi-calendar-plus',
        disabled: true,
      },
      {
        label: 'requestChanges',
        i18nKey: 'gridEvent.requestChanges',
        icon: 'pi pi-pencil',
        disabled: true,
      },
    ],
  },
};

describe('ScheduleListMapperService', () => {
  describe('mapToScheduleListItemModel', () => {
    test('should return an empty array when dto.data is null or undefined', () => {
      // Arrange
      const dtoWithDataNull: ScheduleListDto = {
        data: null as unknown as [],
        isSuccess: true,
      };
      const dtoWithDataUndefined: ScheduleListDto = {
        data: undefined as unknown as [],
        isSuccess: true,
      };
      const hasScheduleEditPermission = true;
      const isDnvUser = false;

      // Act
      const resultWithDataNull =
        ScheduleListMapperService.mapToScheduleListItemModel(
          dtoWithDataNull,
          hasScheduleEditPermission,
          isDnvUser,
          false,
        );
      const resultWithDataUndefined =
        ScheduleListMapperService.mapToScheduleListItemModel(
          dtoWithDataUndefined,
          hasScheduleEditPermission,
          isDnvUser,
          false,
        );

      // Assert
      expect(resultWithDataNull).toEqual([]);
      expect(resultWithDataUndefined).toEqual([]);
    });

    test('should map dto to model correctly with overridden values', () => {
      // Arrange
      const dto: ScheduleListDto = {
        isSuccess: true,
        data: [
          { ...baseDtoItem },
          {
            ...baseDtoItem,
            siteAuditId: 2,
            status: ScheduleStatus.Confirmed,
            services: ['Service B'],
            site: 'Site B',
            city: 'City B',
          },
        ],
      };

      const expected: ScheduleListItemModel[] = [
        { ...baseExpectedItem },
        {
          ...baseExpectedItem,
          scheduleId: 2,
          siteAuditId: 2,
          status: 'Confirmed',
          service: 'Service B',
          site: 'Site B',
          city: 'City B',
          eventActions: {
            id: 2,
            displayConfirmButton: false,
            displayConfirmedLabel: true,
            actions: [
              {
                label: 'shareInvite',
                i18nKey: 'gridEvent.shareInvite',
                icon: 'pi pi-share-alt',
                disabled: true,
              },
              {
                label: 'addToCalendar',
                i18nKey: 'gridEvent.addToCalendar',
                icon: 'pi pi-calendar-plus',
                disabled: true,
              },
              {
                label: 'requestChanges',
                i18nKey: 'gridEvent.requestChanges',
                icon: 'pi pi-pencil',
                disabled: true,
              },
            ],
          },
        },
      ];

      // Act
      const result = ScheduleListMapperService.mapToScheduleListItemModel(
        dto,
        true,
        false,
        false,
      );

      // Assert
      expect(result).toEqual(expected);
    });

    test('should map correctly actions based on isDnvUser flag', () => {
      // Arrange
      const dto: ScheduleListDto = {
        isSuccess: true,
        data: [{ ...baseDtoItem }],
      };

      const expected: ScheduleListItemModel[] = [
        {
          ...baseExpectedItem,
          eventActions: {
            id: 1,
            displayConfirmButton: false,
            displayConfirmedLabel: false,
            actions: [
              {
                label: 'shareInvite',
                i18nKey: 'gridEvent.shareInvite',
                icon: 'pi pi-share-alt',
                disabled: true,
              },
              {
                label: 'addToCalendar',
                i18nKey: 'gridEvent.addToCalendar',
                icon: 'pi pi-calendar-plus',
                disabled: true,
              },
              {
                label: 'requestChanges',
                i18nKey: 'gridEvent.requestChanges',
                icon: 'pi pi-pencil',
                disabled: true,
              },
            ],
          },
        },
      ];

      // Act
      const result = ScheduleListMapperService.mapToScheduleListItemModel(
        dto,
        true,
        true,
        true,
      );

      // Assert
      expect(result).toEqual(expected);
    });

    test('should correctly handle empty dto.data array', () => {
      // Arrange
      const dto: ScheduleListDto = { data: [], isSuccess: true };
      const hasScheduleEditPermission = true;
      const isDnvUser = false;

      // Act
      const result = ScheduleListMapperService.mapToScheduleListItemModel(
        dto,
        hasScheduleEditPermission,
        isDnvUser,
        false,
      );

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('mapToCertificateExcelPayloadDto', () => {
    test('should map filterConfig to CertificateExcelPayloadDto correctly', () => {
      // Arrange
      const filterConfig: FilteringConfig = {
        auditType: {
          value: [{ label: 'Initial Audit', value: 'Initial Audit' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        city: {
          value: [{ label: 'New York', value: 'New York' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        service: {
          value: [{ label: 'Service A', value: 'Service A' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        leadAuditor: {
          value: [{ label: 'John Doe', value: 'John Doe' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        site: {
          value: [{ label: 'Site A', value: 'Site A' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        status: {
          value: [{ label: 'Completed', value: 'Completed' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        startDate: {
          value: [{ label: '01-05-2024', value: '01-05-2024' }],
          matchMode: FilterMode.DateBefore,
          operator: FilterOperator.And,
        },
        endDate: {
          value: [{ label: '02-05-2024', value: '02-05-2024' }],
          matchMode: FilterMode.DateBefore,
          operator: FilterOperator.And,
        },
        siteRepresentative: {
          value: [{ label: 'Rep A', value: 'Rep A' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        company: {
          value: [{ label: 'Company A', value: 'Company A' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      const expected: ScheduleExcelPayloadDto = {
        filters: {
          auditType: ['Initial Audit'],
          city: ['New York'],
          service: ['Service A'],
          leadAuditor: ['John Doe'],
          site: ['Site A'],
          status: ['Completed'],
          startDate: ['2024-05-01'],
          endDate: ['2024-05-02'],
          siteRepresentative: ['Rep A'],
          company: ['Company A'],
          siteAuditId: null,
        },
      };

      // Act
      const result =
        ScheduleListMapperService.mapToScheduleExcelPayloadDto(filterConfig);

      // Assert
      expect(result).toEqual(expected);
    });

    test('should handle empty filter values', () => {
      // Arrange
      const filterConfig: FilteringConfig = {
        auditType: {
          value: [{ label: 'Initial Audit', value: 'Initial Audit' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        city: {
          value: [{ label: 'New York', value: 'New York' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result =
        ScheduleListMapperService.mapToScheduleExcelPayloadDto(filterConfig);

      const expected = {
        filters: {
          auditType: ['Initial Audit'],
          city: ['New York'],
          service: null,
          leadAuditor: null,
          site: null,
          status: null,
          startDate: null,
          endDate: null,
          siteRepresentative: null,
          company: null,
          siteAuditId: null,
        },
      };

      // Assert
      expect(result).toEqual(expected);
    });
  });

  test('should map dto correctly when user is a DNV user with edit permission', () => {
    // Arrange
    const hasScheduleEditPermission = true;
    const isDnvUser = true;

    const dto: ScheduleListDto = {
      data: [
        {
          siteAuditId: 100,
          startDate: '2024-09-01T09:00:00Z',
          endDate: '2024-09-01T17:00:00Z',
          status: ScheduleStatus.ToBeConfirmed,
          services: ['Service X'],
          site: 'DNV Site',
          city: 'Oslo',
          auditType: 'ISO',
          leadAuditor: 'DNV Auditor',
          siteRepresentatives: ['DNV Rep'],
          company: 'DNV Company',
          siteAddress: 'Peliyagoda Warehouse Complex',
          auditID: 2420775,
          siteZip: 140456,
          siteCountry: 'Sri Lanka',
          siteState: '',
          reportingCountry: 'LK',
          projectNumber: 'PRJC-73422-2008-MSC-LKA',
        },
      ],
      isSuccess: true,
    };

    const expected: ScheduleListItemModel[] = [
      {
        scheduleId: 100,
        siteAuditId: 100,
        startDate: '01-09-2024',
        endDate: '01-09-2024',
        status: 'To Be Confirmed',
        service: 'Service X',
        site: 'DNV Site',
        city: 'Oslo',
        auditType: 'ISO',
        leadAuditor: 'DNV Auditor',
        siteRepresentative: 'DNV Rep',
        company: 'DNV Company',
        siteAddress: 'Peliyagoda Warehouse Complex',
        auditID: 2420775,
        siteZip: 140456,
        siteCountry: 'Sri Lanka',
        siteState: '',
        reportingCountry: 'LK',
        projectNumber: 'PRJC-73422-2008-MSC-LKA',
        eventActions: {
          id: 100,
          displayConfirmButton: false,
          displayConfirmedLabel: false,
          actions: [
            {
              label: 'shareInvite',
              i18nKey: 'gridEvent.shareInvite',
              icon: 'pi pi-share-alt',
              disabled: true,
            },
            {
              label: 'addToCalendar',
              i18nKey: 'gridEvent.addToCalendar',
              icon: 'pi pi-calendar-plus',
              disabled: true,
            },
            {
              label: 'requestChanges',
              i18nKey: 'gridEvent.requestChanges',
              icon: 'pi pi-pencil',
              disabled: true,
            },
          ],
        },
      },
    ];

    // Act
    const result = ScheduleListMapperService.mapToScheduleListItemModel(
      dto,
      hasScheduleEditPermission,
      isDnvUser,
      false,
    );

    // Assert
    expect(result).toEqual(expected);
  });
});
