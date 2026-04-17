import { BaseApolloResponse } from '@customer-portal/shared';

export interface ConfirmScheduleModel {
  scheduleId: number;
  startDate: string;
  endDate: string;
  site: string;
  auditType: string;
  auditor: string;
  address: string;
  services: string[];
}

export interface ConfirmProposedScheduleResponse {
  data: {
    confirmProposedSchedule: ConfirmProposedSchedule;
  };
}

export interface ConfirmProposedSchedule extends BaseApolloResponse<string> {
  data: string;
}

export interface RescheduleAuditResponse {
  data: {
    rescheduleAudit: RescheduleAudit;
  };
}

export interface RescheduleAudit extends BaseApolloResponse<number> {
  data: number;
}
