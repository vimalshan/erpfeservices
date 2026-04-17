import {
  convertToUtcDate,
  utcDateToPayloadFormat,
} from '@customer-portal/shared/helpers/date';
import { mapFilterConfigToValues } from '@customer-portal/shared/helpers/grid';
import {
  FilteringConfig,
  GridFileActionType,
} from '@customer-portal/shared/models/grid';

import {
  ContractListItemDto,
  ContractsExcelPayloadDto,
  ContractsListDto,
} from '../../dtos';
import { ContractsListItemModel } from '../../models';

export class ContractsListMapperService {
  static mapToContractListItemModel(
    dto: ContractsListDto,
  ): ContractsListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((contractItem: ContractListItemDto) => ({
      contractId: contractItem.contractId,
      contractName: contractItem.contractName,
      contractType: contractItem.contractType,
      company: contractItem.company,
      service: contractItem.service,
      sites: contractItem.sites,
      dateAdded: convertToUtcDate(contractItem.dateAdded),
      actions: [
        {
          label: 'download',
          iconClass: 'pi-download',
          actionType: GridFileActionType.Download,
        },
      ],
      fileName: contractItem.contractName,
      documentId: contractItem.contractId,
    }));
  }

  static mapToContractsExcelPayloadDto(
    filterConfig: FilteringConfig,
  ): ContractsExcelPayloadDto {
    return {
      filters: {
        contractName: mapFilterConfigToValues(filterConfig, 'contractName'),
        contractType: mapFilterConfigToValues(filterConfig, 'contractType'),
        company: mapFilterConfigToValues(filterConfig, 'company'),
        service: mapFilterConfigToValues(filterConfig, 'services'),
        siteName: mapFilterConfigToValues(filterConfig, 'site'),
        dateAdded: mapFilterConfigToValues(
          filterConfig,
          'dateAdded',
          null,
          utcDateToPayloadFormat,
        ),
      },
    };
  }
}
