import { BaseApolloResponse } from '@customer-portal/shared';

export interface OverviewCardsListDto
  extends BaseApolloResponse<OverviewCardsDto> {
  data: OverviewCardsDto;
}

export interface OverviewCardListItemDto {
  data: OverviewCardItemDto[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface OverviewCardsDto {
  data: OverviewCardItemDto[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  isSuccess: boolean;
  message: string;
}

interface YearValue {
  count: number;
  seq: number;
  statusValue: string;
  totalCount: number;
}

export interface OverviewCardYearDatum {
  year: number;
  values: YearValue[];
}

export interface OverviewCardItemDto {
  serviceName: string;
  yearData: OverviewCardYearDatum[];
}
