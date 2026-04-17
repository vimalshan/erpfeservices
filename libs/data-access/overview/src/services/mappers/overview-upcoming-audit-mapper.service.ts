import { OverviewUpcomingAuditDataDto } from '../../dtos';

export class OverviewUpcomingAuditMapperService {
  static mapToOverviewUpcomingAudit(dto: OverviewUpcomingAuditDataDto) {
    return [
      ...dto.confirmed.map((date) => ({
        title: 'Confirmed',
        start: date,
        end: date,
        color: '#3F9C35',
      })),
      ...dto.toBeConfirmed.map((date) => ({
        title: 'To Be Confirmed',
        start: date,
        end: date,
        color: '#FFE900',
      })),
      ...dto.toBeConfirmedByDNV.map((date) => ({
        title: 'To Be Confirmed by DNV',
        start: date,
        end: date,
        color: '#009FDA',
      })),
    ];
  }
}
