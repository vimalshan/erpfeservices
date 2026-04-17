import { BaseApolloResponse } from "@customer-portal/shared";

export interface FindingGraphsFilterSitesDto{
  data: FindingGraphsFilterSitesDataDto[];
  isSuccess: boolean;
}

export interface FindingGraphsFilterSitesDataDto {
  id: number;
  label: string;
  children?: FindingGraphsFilterSitesDataDto[];
}

export interface FindingStatusByCategoryGraphDto 
extends BaseApolloResponse<FindingStatusByCategoryGraphData> {
  data: FindingStatusByCategoryGraphData;
}


export interface FindingStatusByCategoryGraphData {
  stats: FindingStatusByCategoryStatistics[];
}

export interface FindingStatusByCategoryStatistics {
  category: string;
  statuses: FindingStatisticsDto[];
}

export interface FindingStatisticsDto {
  status: string;
  count: number;
}
