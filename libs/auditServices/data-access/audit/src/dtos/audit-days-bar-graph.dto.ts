export interface AuditDaysBarGraphDto {
  data: AuditDaysBarGraphData;
}

export interface AuditDaysBarGraphData {
  chartData: {
    month: string;
    serviceData: ServiceDatum[];
  }[];
}

interface ServiceDatum {
  serviceName: string;
  auditDays: number;
}
