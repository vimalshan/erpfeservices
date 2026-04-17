import { UnreadNotificationCountDto } from '../../dtos';
import { UnreadNotificationCountModel } from '../../models';

export class UnreadNotificationCountMapperService {
  static mapToUnreadNotificationCountModel(
    dto: UnreadNotificationCountDto,
  ): UnreadNotificationCountModel {
    return {
      count: dto?.data ?? 0,
    };
  }
}
