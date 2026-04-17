import { TreeNode } from 'primeng/api';
import { BaseApolloResponse } from '@customer-portal/shared';

export interface FindingsTrendsDataDto extends BaseApolloResponse<TreeNode[]> {
  data: TreeNode[];
}

export interface FindingsByYearAndLocation {
  location: string;
  currentYear: number;
  lastYear: number;
  yearBeforeLast: number;
  yearMinus3: number;
}

export interface FindingsBySite {
  data: FindingsByYearAndLocation;
}

export interface FindingsByCity{
  data: FindingsByYearAndLocation;
  children: FindingsBySite[];
}

export interface FindingByCountry{
  data: FindingsByYearAndLocation;
  children: FindingsByCity[];
}

export interface FindingsTrendsResponse extends BaseApolloResponse<FindingByCountry[]> {
  data: FindingByCountry[];
}