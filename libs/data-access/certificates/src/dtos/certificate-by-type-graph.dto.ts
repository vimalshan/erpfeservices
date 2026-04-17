import { CertificateStatisticsDto } from './certificate-statistics.dto';

export interface CertificatesByTypeGraphDto {
  data: CertificatesByTypeGraphData;
}

export interface CertificatesByTypeGraphData {
  stats: CertificatesByTypeStatistics[];
}

export interface CertificatesByTypeStatistics {
  service: string;
  statuses: CertificateStatisticsDto[];
}
