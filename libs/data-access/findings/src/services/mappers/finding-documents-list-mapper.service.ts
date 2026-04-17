import { convertToUtcDate } from '@customer-portal/shared/helpers/date';
import { GridFileActionType } from '@customer-portal/shared/models/grid';

import {
  FindingDocumentListItemDto,
  FindingDocumentsListDto,
} from '../../dtos';
import { FindingDocumentListItemModel } from '../../models';

export class FindingDocumentsListMapperService {
  static mapToFindingDocumentItemModel(
    dto: FindingDocumentsListDto,
    hasFindingsEditPermission: boolean,
    isDnvUser: boolean,
  ): FindingDocumentListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((findingDocument: FindingDocumentListItemDto) => {
      const item: FindingDocumentListItemModel = {
        documentId: findingDocument.documentId,
        fileName: findingDocument.fileName,
        fileType: findingDocument.type,
        dateAdded: convertToUtcDate(findingDocument.dateAdded),
        uploadedBy: findingDocument.uploadedBy,
        canBeDeleted: findingDocument.canBeDeleted,
        actions: [
          {
            label: 'download',
            iconClass: 'pi-download',
            url: findingDocument.documentUrl,
            actionType: GridFileActionType.Download,
          },
        ],
      };

      const canBeDeleted =
        !isDnvUser && item.canBeDeleted && hasFindingsEditPermission;

      if (canBeDeleted) {
        item.actions.push({
          label: 'delete',
          iconClass: 'pi-trash',
          actionType: GridFileActionType.Delete,
        });
      }

      return item;
    });
  }
}
