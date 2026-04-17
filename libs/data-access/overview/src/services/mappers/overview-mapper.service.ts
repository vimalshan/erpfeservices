import { CardDataModel } from '@customer-portal/shared';

import { OverviewCardsDto } from '../../dtos';
import { OverviewCardPageInfoModel } from '../../models';

const SEQ_SERVICE_INFO_MAP: Record<number, { name: string; textInfo: string }> =
  {
    1: {
      name: 'Schedule',
      textInfo: 'overview.cardTexts.schedule',
    },
    2: {
      name: 'Audit',
      textInfo: 'overview.cardTexts.audits',
    },
    3: {
      name: 'Findings',
      textInfo: 'overview.cardTexts.findings',
    },
    4: {
      name: 'Certificates',
      textInfo: 'overview.cardTexts.certificates',
    },
  };

export class OverviewMapperService {
  static mapToOverviewCardModel(dto: OverviewCardsDto): CardDataModel[] | null {
    if (!dto || !dto.data?.length) {
      return null;
    }

    return dto.data.map((item) => ({
      cardData: {
        service: item.serviceName,
        yearlyData: item.yearData.map((yearItem, yearIndex) => ({
          year: {
            label: yearItem.year.toString(),
            index: yearIndex,
          },
          details: yearItem.values.map((value) => ({
            entity: SEQ_SERVICE_INFO_MAP[value.seq]?.name,
            entityTranslationKey: SEQ_SERVICE_INFO_MAP[value.seq]?.textInfo,
            stats: {
              currentValue: value.count,
              maxValue: value.totalCount,
              percentage: (value.count * 100) / value.totalCount || 0,
            },
          })),
        })),
      },
    }));
  }

  static mapToPageInfo(dto: OverviewCardsDto): OverviewCardPageInfoModel {
    if (!dto || !dto.data?.length) {
      return {
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
      };
    }

    const { currentPage, totalItems, totalPages } = dto;

    return {
      currentPage,
      totalItems,
      totalPages,
    };
  }
}
