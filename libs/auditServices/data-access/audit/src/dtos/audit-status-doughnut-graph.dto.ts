import { AuditStatisticsDto } from './audit-statistics.dto';

export interface AuditsStatusDoughnutGraphDto {
  data: AuditsStatusDoughnutGraphData;
}

export interface AuditsStatusDoughnutGraphData {
  stats: AuditStatisticsDto[];
  totalAudits: number;
}
