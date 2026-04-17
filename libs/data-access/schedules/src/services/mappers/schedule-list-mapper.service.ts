import {
  ServiceMasterListItemModel,
  SiteMasterListItemModel,
} from '@customer-portal/data-access/global';
import { COLUMN_DELIMITER } from '@customer-portal/shared/constants';
import {
  formatUtcToLocal,
  isDateInPast,
  utcDateInFuture,
  utcDateInPast,
  utcDateToPayloadFormat,
} from '@customer-portal/shared/helpers/date';
import { mapFilterConfigToValues } from '@customer-portal/shared/helpers/grid';
import { EventAction, EventActionItem } from '@customer-portal/shared/models';
import {
  FilteringConfig,
  GridEventActionType,
} from '@customer-portal/shared/models/grid';

import { ScheduleStatus } from '../../constants';
import {
  ScheduleExcelPayloadDto,
  ScheduleListDto,
  ScheduleListItemDto,
} from '../../dtos';
import { ScheduleListItemModel } from '../../models';

export class ScheduleListMapperService {
  static mapToScheduleListItemModel(
    dto: ScheduleListDto,
    hasScheduleEditPermission: boolean,
    isDnvUser: boolean,
    isAdminUser: boolean,
    siteMasterList: SiteMasterListItemModel[],
    serviceMasterList: ServiceMasterListItemModel[],
  ): ScheduleListItemModel[] {
    if (!dto.data) {
      return [];
    }

    const { data } = dto;

    return data.map((scheduleItem: ScheduleListItemDto) =>
      this.mapSingleItem(
        scheduleItem,
        hasScheduleEditPermission,
        isDnvUser,
        isAdminUser,
        siteMasterList,
        serviceMasterList,
      ),
    );
  }

  static mapToScheduleExcelPayloadDto(
    filterConfig: FilteringConfig,
  ): ScheduleExcelPayloadDto {
    return {
      filters: {
        auditType: mapFilterConfigToValues(filterConfig, 'auditType'),
        city: mapFilterConfigToValues(filterConfig, 'city'),
        service: mapFilterConfigToValues(filterConfig, 'service'),
        leadAuditor: mapFilterConfigToValues(filterConfig, 'leadAuditor'),
        site: mapFilterConfigToValues(filterConfig, 'site'),
        status: mapFilterConfigToValues(filterConfig, 'status'),
        startDate: mapFilterConfigToValues(
          filterConfig,
          'startDate',
          null,
          utcDateToPayloadFormat,
        ),
        endDate: mapFilterConfigToValues(
          filterConfig,
          'endDate',
          null,
          utcDateToPayloadFormat,
        ),
        siteRepresentative: mapFilterConfigToValues(
          filterConfig,
          'siteRepresentative',
        ),
        company: mapFilterConfigToValues(filterConfig, 'company'),
        siteAuditId: mapFilterConfigToValues(filterConfig, 'siteAuditId'),
      },
    };
  }

  private static mapSingleItem(
    item: ScheduleListItemDto,
    hasScheduleEditPermission: boolean,
    isDnvUser: boolean,
    isAdminUser: boolean,
    siteMasterList: SiteMasterListItemModel[],
    serviceMasterList: ServiceMasterListItemModel[],
  ): ScheduleListItemModel {
    const serviceMap = new Map(
      serviceMasterList.map((s) => [String(s.id), s.serviceName]),
    );
    const companyMap = new Map(
      siteMasterList.map((s) => [String(s.companyId), s]),
    );
    const siteMap = new Map(siteMasterList.map((s) => [String(s.id), s]));

    const companyName =
      companyMap.get(String(item.companyId))?.companyName ?? '';
    const site = siteMap.get(String(item.siteId));
    const services = Array.from(
      new Set(
        (item.serviceIds || [])
          .map((serviceId) => serviceMap.get(String(serviceId)))
          .filter(Boolean),
      ),
    ).join(COLUMN_DELIMITER);
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
      scheduleId: item.siteAuditId,
      startDate: formatUtcToLocal(item.startDate, localZone),
      endDate: formatUtcToLocal(item.endDate, localZone),
      status: item.status,
      service: services,
      site: site?.siteName ?? '',
      city: site?.city ?? '',
      auditType: item.auditType,
      leadAuditor: item.leadAuditor,
      siteRepresentative: this.joinUnique(item.siteRepresentatives),
      company: companyName,
      siteAuditId: item.siteAuditId,
      siteAddress: site?.formattedAddress ?? '',
      auditID: item.auditID,
      accountDNVId: item.accountDNVId,
      siteZip: site?.siteZip ?? '',
      siteCountry: site?.countryName ?? '',
      siteState: site?.siteState ?? '',
      reportingCountry: item.reportingCountry,
      projectNumber: item.projectNumber,
      eventActions: this.buildEventActions(
        item,
        hasScheduleEditPermission,
        isDnvUser,
        isAdminUser,
      ),
    };
  }

  private static joinUnique(items: string[]): string {
    return Array.from(new Set(items)).join(COLUMN_DELIMITER);
  }

  private static areEqualStatuses(
    itemStatus: string,
    status: ScheduleStatus,
  ): boolean {
    return itemStatus.toLowerCase() === status.toLowerCase();
  }

  private static buildEventActions(
    item: ScheduleListItemDto,
    hasScheduleEditPermission: boolean,
    isDnvUser: boolean,
    isAdminUser: boolean,
  ): EventAction {
    const isStartDatePast = isDateInPast(item.startDate);
    const isToBeConfirmed = this.areEqualStatuses(
      item.status,
      ScheduleStatus.ToBeConfirmed,
    );
    const isConfirmed = this.areEqualStatuses(
      item.status,
      ScheduleStatus.Confirmed,
    );

    return {
      id: item.siteAuditId,
      displayConfirmButton:
        !isDnvUser &&
        isToBeConfirmed &&
        !isStartDatePast &&
        hasScheduleEditPermission,
      displayConfirmedLabel: isConfirmed,
      actions: this.buildEventActionItems(
        item,
        hasScheduleEditPermission,
        isDnvUser,
        isAdminUser,
      ),
    };
  }

  private static buildEventActionItems(
    item: ScheduleListItemDto,
    hasScheduleEditPermission: boolean,
    isDnvUser: boolean,
    isAdminUser: boolean,
  ): EventActionItem[] {
    if (this.areEqualStatuses(item.status, ScheduleStatus.ToBeConfirmedByDnv)) {
      return [];
    }

    if (!isAdminUser) {
      return [];
    }
    const isScheduleInPast = utcDateInPast(item.startDate);
    const isScheduleInFuture = utcDateInFuture(item.startDate);
    const isConfirmed = this.areEqualStatuses(
      item.status,
      ScheduleStatus.Confirmed,
    );
    const isToBeConfirmed = this.areEqualStatuses(
      item.status,
      ScheduleStatus.ToBeConfirmed,
    );
    const isToBeConfirmedByDnv = this.areEqualStatuses(
      item.status,
      ScheduleStatus.ToBeConfirmedByDnv,
    );

    const allActions: EventActionItem[] = [
      {
        label: GridEventActionType.Reschedule,
        i18nKey: 'gridEvent.reschedule',
        icon: 'pi pi-calendar',
        disabled: false,
      },
      {
        label: GridEventActionType.ShareInvite,
        i18nKey: 'gridEvent.shareInvite',
        icon: 'pi pi-share-alt',
        disabled: false,
      },
      {
        label: GridEventActionType.AddToCalendar,
        i18nKey: 'gridEvent.addToCalendar',
        icon: 'pi pi-calendar-plus',
        disabled: false,
      },
      {
        label: GridEventActionType.RequestChanges,
        i18nKey: 'gridEvent.requestChanges',
        icon: 'pi pi-pencil',
        disabled: isDnvUser,
      },
    ];

    return allActions.filter((action) => {
      switch (action.label) {
        case GridEventActionType.Reschedule:
          if (
            isScheduleInPast &&
            (isToBeConfirmed || isToBeConfirmedByDnv || isConfirmed)
          ) {
            return false;
          }

          return isScheduleInFuture && !isDnvUser && hasScheduleEditPermission;
        case GridEventActionType.ShareInvite:
        case GridEventActionType.AddToCalendar:
          if (isConfirmed && isScheduleInPast) {
            return false;
          }

          if (isScheduleInPast && (isToBeConfirmed || isToBeConfirmedByDnv)) {
            return false;
          }

          return !isScheduleInPast;

        case GridEventActionType.RequestChanges:
          return true;

        default:
          return false;
      }
    });
  }
}
