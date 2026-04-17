import { EMPTY_GRAPH_DATA } from '@customer-portal/shared/constants';
import { buildStatusColorPalette } from '@customer-portal/shared/helpers/chart';
import { DoughnutChartModel } from '@customer-portal/shared/models/chart';

import { OverviewFinancialStatusGraphWrapperDto } from '../../dtos';
import { DoughnutChartWithStatus } from '../../models';

const OVERVIEW_FINANCIAL_STATUS_COLOR_MAPPING: Record<string, string> = {
  Overdue: '#D3262F',
  'Not Paid': '#FFF377',
  'Partially Paid': '#FA8F45',
  Paid: '#3F9C35',
};
export class OverviewFinancialStatusMapperService {
  static mapToOverviewFinancialStatusModel(
    dto: OverviewFinancialStatusGraphWrapperDto,
  ): DoughnutChartWithStatus {
    const getFinancialWidgetData = dto?.getWidgetforFinancials;

    if (!getFinancialWidgetData?.isSuccess) {
      return {
        ...EMPTY_GRAPH_DATA,
        isSuccess: false,
        message: 'Failed to load',
      };
    }

    if (
      !getFinancialWidgetData?.data?.length ||
      getFinancialWidgetData.data.every((d) => d.financialCount === 0)
    ) {
      return {
        ...EMPTY_GRAPH_DATA,
        isSuccess: true,
        message: '',
      };
    }

    const statuses = Array.from(
      new Set(
        getFinancialWidgetData.data.map(
          ({ financialStatus }) => financialStatus,
        ),
      ),
    );
    const colorPalette = buildStatusColorPalette(
      statuses,
      OVERVIEW_FINANCIAL_STATUS_COLOR_MAPPING,
    );

    const dataset: number[] = [];
    const percentageValues: Record<string, number> = {};

    getFinancialWidgetData.data.forEach((s) => {
      dataset.push(s.financialCount);
      percentageValues[s.financialStatus] = s.financialpercentage!;
    });

    const model: DoughnutChartModel = {
      data: {
        labels: statuses,
        datasets: [
          {
            data: dataset,
            backgroundColor: colorPalette,
            hoverBackgroundColor: colorPalette,
          },
        ],
        percentageValues,
      },
    };

    return {
      ...model,
      isSuccess: true,
      message: '',
    };
  }
}
