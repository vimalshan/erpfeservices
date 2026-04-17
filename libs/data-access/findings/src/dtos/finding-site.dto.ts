import { BaseApolloResponse } from "@customer-portal/shared";

export interface FindingSiteDto {
  id: number;
  name: string;
}
interface CategoryCount {
  category: string;
  count: number;
}

interface Countries {
  id: number;
  name: string;
  categories: CategoryCount[];
  totalCount: number;
  __typename?: string;
}

interface Cities {
  name: string;
  categories: CategoryCount[];
  totalCount: number;
  __typename?: string;
}


interface Site {
  id: number;
  name: string;
  categories: CategoryCount[];
  totalCount: number;
  __typename?: string;
}

interface SiteList{
  data: Site;
  __typename?: string;
}

interface CitiesList{
  data: Cities;
  children: SiteList[];
  __typename?: string;
}

interface GetFindingSiteResponse {
  data: Countries;
  children: CitiesList[];
  __typename?: string;
}

export interface FindingsSiteResponse 
extends BaseApolloResponse<GetFindingSiteResponse[]> {
  data: GetFindingSiteResponse[];
}