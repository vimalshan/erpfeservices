import { UnreadActionsDto } from '../../dtos';
import { UnreadActionsCountModel } from '../../models';

export class UnreadActionsCountMapperService {
  static mapToUnreadActionsCountModel(
    dto: UnreadActionsDto,
  ): UnreadActionsCountModel {
    return {
      count: dto?.actionsCount?.data ?? 0,
    };
  }
}
