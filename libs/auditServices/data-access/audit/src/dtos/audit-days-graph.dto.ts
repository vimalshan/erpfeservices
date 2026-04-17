export interface AuditsDaysGraphDto {
  data: AuditsDaysGraphData;
}

export interface AuditsDaysGraphData {
  pieChartData: AuditDaysStatisticsDto[];
  totalServiceAuditsDayCount: number;
}

export interface AuditDaysStatisticsDto {
  serviceName: string;
  auditDays: number;
  auditpercentage: number;
}
