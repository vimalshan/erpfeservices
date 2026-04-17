import { FindingStatusStatisticsDto } from './finding-status-statistics.dto';
import { BaseApolloResponse } from '@erp-services/shared';
export interface FindingsByStatusGraphDto extends BaseApolloResponse<FindingsByStatusGraphData> {
  data: FindingsByStatusGraphData;
  isSuccess?: boolean;
}

export interface FindingsByStatusGraphData {
  stats: FindingStatusStatisticsDto[];
  totalFindings: number;
}
