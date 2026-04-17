import { ChartData } from 'chart.js';

import { ChartTypeEnum } from '@erp-services/shared';

export interface FindingTrendsGraphModel {
  data: ChartData<ChartTypeEnum.Line>;
}
