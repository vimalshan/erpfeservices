import { ActionsListDto } from '../../dtos';
import { ActionsModel } from '../../models';
import { ActionsListMapperService } from './actions-list-mapper.service';

describe('ActionListMapperService', () => {
  test('should return an empty array', () => {
    const dto: ActionsListDto = {
      items: [],
      currentPage: 0,
      totalItems: 0,
      totalPages: 0,
    };

    const mockDomSanitizer = { sanitize: (html: string) => html } as any;
    const result: ActionsModel[] =
      ActionsListMapperService.mapToActionsListItemModel(dto, mockDomSanitizer);
    const expectedResult: ActionsModel[] = [];

    expect(result).toEqual(expectedResult);
  });
});
