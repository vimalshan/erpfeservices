export interface AuditDaysGridDto {
  data: AuditDaysNodeDto[];
  isSuccess: boolean;
  message: string;
  errorCode: string;
}

export interface AuditDaysNodeDto {
  data: AuditDaysDataDto;
  children?: AuditDaysNodeDto[];
}

export interface AuditDaysDataDto {
  id?: number;
  name: string;
  auditDays: number;
  dataType: string;
}
