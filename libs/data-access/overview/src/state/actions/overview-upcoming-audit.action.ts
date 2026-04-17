export class LoadOverviewUpcomingAuditEvents {
  static readonly type = '[UpcomingAudits] Load Upcoming Audit Events';

  constructor(
    public selectedMonth: number,
    public selectedYear: number,
  ) {}
}
