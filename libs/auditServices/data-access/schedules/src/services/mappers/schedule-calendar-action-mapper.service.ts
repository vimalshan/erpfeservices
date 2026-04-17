import {
  ScheduleCalendarInviteCalendarAttributesDto,
  ScheduleCalendarRescheduleReasonDataDto,
} from '../../dtos';
import {
  ScheduleCalendarInviteCalendarAttributesModel,
  ScheduleCalendarRescheduleReasonModel,
} from '../../models';

export class ScheduleCalendarActionMapper {
  static mapToScheduleCalendarInviteCalendarAttributesModel(
    dto: ScheduleCalendarInviteCalendarAttributesDto,
  ): ScheduleCalendarInviteCalendarAttributesModel {
    return {
      auditType: dto?.auditType ?? '',
      endDate: dto?.endDate,
      leadAuditor: dto?.leadAuditor ?? '',
      service: dto?.service ?? '',
      site: dto?.site ?? '',
      siteAddress: dto?.siteAddress ?? '',
      siteRepresentative: dto?.siteRepresentative ?? '',
      startDate: dto?.startDate,
    };
  }

  static mapToScheduleCalendarRescheduleReasonModel(
    data: ScheduleCalendarRescheduleReasonDataDto[],
  ): ScheduleCalendarRescheduleReasonModel[] {
    return data.map((d) => ({
      label: d.reasonDescription,
      value: d.reasonDescription,
    }));
  }
}
