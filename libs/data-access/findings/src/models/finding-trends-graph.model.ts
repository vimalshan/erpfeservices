import { ChartData } from 'chart.js';

import { ChartTypeEnum } from '@customer-portal/shared';

export interface FindingTrendsGraphModel {
  data: ChartData<ChartTypeEnum.Line>;
}
