import { DoughnutChartModel } from '@erp-services/shared';

export interface DoughnutChartWithStatus extends DoughnutChartModel {
  message: string;
  isSuccess: boolean;
}
