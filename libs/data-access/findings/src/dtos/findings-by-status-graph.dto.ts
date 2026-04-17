import { FindingStatusStatisticsDto } from './finding-status-statistics.dto';
import { BaseApolloResponse } from '@customer-portal/shared';
export interface FindingsByStatusGraphDto extends BaseApolloResponse<FindingsByStatusGraphData> {
  data: FindingsByStatusGraphData;
}

export interface FindingsByStatusGraphData {
  stats: FindingStatusStatisticsDto[];
  totalFindings: number;
}
