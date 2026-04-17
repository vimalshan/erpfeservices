import { DoughnutChartModel } from '@customer-portal/shared';

export interface DoughnutChartWithStatus extends DoughnutChartModel {
  message: string;
  isSuccess: boolean;
}
