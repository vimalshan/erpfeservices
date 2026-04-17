import { AuditStatisticsDto } from './audit-statistics.dto';

export interface AuditStatusBarGraphDto {
  data: AuditStatusBarGraphData;
}

export interface AuditStatusBarGraphData {
  stats: AuditByTypeStatistics[];
}

export interface AuditByTypeStatistics {
  type: string;
  statuses: AuditStatisticsDto[];
}
