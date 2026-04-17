import { OpenFindingsStatisticsDto } from './open-findings-statistics.dto';
import { BaseApolloResponse } from '@erp-services/shared';

export interface OpenFindingsGraphDto extends BaseApolloResponse<OpenFindingsGraphData> {
  data: OpenFindingsGraphData;
  isSuccess?: boolean;
}

export interface OpenFindingsGraphData {
  services: OpenFindingsStatistics[];
}

export interface OpenFindingsStatistics {
  service: string;
  categories: OpenFindingsStatisticsDto[];
}
