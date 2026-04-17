import { CertificateStatisticsDto } from './certificate-statistics.dto';

export interface CertificatesByStatusGraphDto {
  data: CertificatesByStatusGraphData;
}

export interface CertificatesByStatusGraphData {
  statusCounts: CertificateStatisticsDto[];
  totalCertificates: number;
}
