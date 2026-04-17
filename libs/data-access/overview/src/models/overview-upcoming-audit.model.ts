export interface OverviewUpcomingAuditEvent {
  title: string;
  start: string;
  end: string;
  color: string;
}

export interface OverviewUpcomingAuditsStateModel {
  events: OverviewUpcomingAuditEvent[];
  selectedMonth: number;
  selectedYear: number;
  isLoading: boolean;
  errorMessage: string | null;
}
