import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { ActionsListDto } from '../../dtos';
import { ACTIONS_LIST_QUERY } from '../../graphql';
import { ActionsListService } from './actions-list.service';

describe('ActionsListService', () => {
  let actionsDetailsService: ActionsListService;

  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  beforeEach(() => {
    actionsDetailsService = new ActionsListService(apolloMock as Apollo);
  });

  test('should fetch and map actionList', () => {
    // Arrange
    const category: number[] = [1, 2, 3];
    const service: number[] = [];
    const company: number[] = [];
    const site: number[] = [];
    const isHighPriority = false;
    const pageNumber = 1;
    const pageSize = 10;

    const actionList: ActionsListDto = {
      items: [
        {
          id: 1,
          action: '',
          dueDate: '28.03-2025',
          highPriority: false,
          message: '',
          service: '',
          site: '',
          entityType: 'audit',
          entityId: '1',
        },
      ],
      currentPage: 1,
      totalItems: 26,
      totalPages: 3,
    };

    apolloMock.query = jest.fn().mockReturnValue(of(actionList.items));

    // Act
    actionsDetailsService
      .getActionsList(
        category,
        service,
        company,
        site,
        isHighPriority,
        pageNumber,
        pageSize,
      )
      .subscribe((result) => {
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: ACTIONS_LIST_QUERY,
          variables: {
            category,
            service,
            company,
            site,
            isHighPriority,
            pageNumber,
            pageSize,
          },
          fetchPolicy: 'no-cache',
        });

        // Assert
        expect(result).toBe(actionList);
      });
  });
});
