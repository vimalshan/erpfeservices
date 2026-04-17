import { OpenFindingsStatisticsDto } from './open-findings-statistics.dto';
import { BaseApolloResponse } from '@customer-portal/shared';

export interface OpenFindingsGraphDto extends BaseApolloResponse<OpenFindingsGraphData> {
  data: OpenFindingsGraphData;
}

export interface OpenFindingsGraphData {
  services: OpenFindingsStatistics[];
}

export interface OpenFindingsStatistics {
  service: string;
  categories: OpenFindingsStatisticsDto[];
}
