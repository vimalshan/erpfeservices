export interface OverviewFinancialStatusGraphWrapperDto {
  getWidgetforFinancials: OverviewFinancialStatusGraphDto;
}

export interface OverviewFinancialStatusGraphDto {
  data: OverviewFinancialStatusGraphDataDto[];
  isSuccess: boolean;
  message: string;
}

export interface OverviewFinancialStatusGraphDataDto {
  financialStatus: string;
  financialCount: number;
  financialpercentage: number;
}
