import {
  convertToUtcDate,
  utcDateToPayloadFormat,
} from '@erp-services/shared/helpers/date';
import { mapFilterConfigToValues } from '@erp-services/shared/helpers/grid';
import {
  FilteringConfig,
  GridEventActionType,
  GridFileActionType,
} from '@erp-services/shared/models/grid';

import { InvoiceExcelPayloadDto, InvoiceListItemDto } from '../../dtos';
import { isInvoiceOverdueOrUnpaid } from '../../helpers';
import { InvoiceListItemModel } from '../../models';

export class InvoiceListMapperService {
  static mapToInvoiceItemModel(
    items: InvoiceListItemDto[],
    isAdminUser: boolean,
    isSuaadhyaUser: boolean,
  ): InvoiceListItemModel[] {
    return items.map((item: InvoiceListItemDto) => ({
      amount: item.amount,
      billingAddress: item.billingAddress,
      company: item.company,
      contactPerson: item.contactPerson,
      dueDate: convertToUtcDate(item.dueDate),
      invoiceId: item.invoice,
      issueDate: convertToUtcDate(item.issueDate),
      originalInvoiceNumber: item.originalInvoice,
      plannedPaymentDate: convertToUtcDate(
        item?.plannedPaymentDate ?? undefined,
      ),
      referenceNumber: item.referenceNumber,
      reportingCountry: item.reportingCountry,
      projectNumber: item.projectNumber,
      accountSuaadhyaId: item.accountSuaadhyaId,
      status: item.status,
      actions: [
        {
          label: 'download',
          iconClass: 'pi-download',
          actionType: GridFileActionType.Download,
        },
      ],
      eventActions: {
        id: item.invoice,
        actions: [
          {
            label: GridEventActionType.RequestChanges,
            i18nKey: 'gridEvent.requestChanges',
            icon: 'pi pi-pencil',
            disabled: !isAdminUser || isSuaadhyaUser,
          },
          {
            label: GridEventActionType.UpdatePlannedPaymentDate,
            i18nKey: `gridEvent.${GridEventActionType.UpdatePlannedPaymentDate}`,
            icon: 'pi pi-calendar',
            disabled: isSuaadhyaUser || !isInvoiceOverdueOrUnpaid(item),
          },
        ],
      },
    }));
  }

  static mapToInvoiceExcelPayloadDto(
    filterConfig: FilteringConfig,
  ): InvoiceExcelPayloadDto {
    return {
      filters: {
        invoice: mapFilterConfigToValues(filterConfig, 'invoiceId'),
        status: mapFilterConfigToValues(filterConfig, 'status'),
        billingAddress: mapFilterConfigToValues(filterConfig, 'billingAddress'),
        amount: mapFilterConfigToValues(filterConfig, 'amount'),
        due: mapFilterConfigToValues(
          filterConfig,
          'dueDate',
          null,
          utcDateToPayloadFormat,
        ),
        plannedPaymentDate: mapFilterConfigToValues(
          filterConfig,
          'plannedPaymentDate',
          null,
          utcDateToPayloadFormat,
        ),
        referenceNumber: mapFilterConfigToValues(
          filterConfig,
          'referenceNumber',
        ),
        issueDate: mapFilterConfigToValues(
          filterConfig,
          'issueDate',
          null,
          utcDateToPayloadFormat,
        ),
        contactPerson: mapFilterConfigToValues(filterConfig, 'contactPerson'),
        company: mapFilterConfigToValues(filterConfig, 'company'),
        originalInvoice: mapFilterConfigToValues(
          filterConfig,
          'originalInvoiceNumber',
        ),
      },
    };
  }
}
