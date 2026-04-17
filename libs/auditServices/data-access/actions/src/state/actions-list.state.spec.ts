import { TestBed } from '@angular/core/testing';
import { Actions, NgxsModule, ofActionSuccessful, Store } from '@ngxs/store';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';

import { ActionFilterDataModel, ActionsListModel } from '../models';
import { ActionsListService } from '../services';
import { LoadActionsDetails, LoadActionsFilterList } from './actions';
import { ActionsListState } from './actions-list.state';

describe('ActionsState', () => {
  let actions$: Observable<any>;
  let store: Store;
  let apolloMock: any;

  const actionsListServiceMock = {
    getActionsList: jest.fn(),
    getActionFilterCategories: jest.fn(),
  };

  beforeEach(() => {
    apolloMock = {
      use: jest.fn().mockReturnValue({
        query: jest
          .fn()
          .mockReturnValue(of({ data: { categoriesFilter: [] } })),
      }),
    };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ActionsListState])],
      providers: [
        {
          provide: ActionsListService,
          useValue: actionsListServiceMock,
        },
        { provide: Apollo, useValue: apolloMock },
      ],
    });

    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions);
  });

  test('should load and transform action-list into state', () => {
    // Arrange
    const mockedActionListResponse: ActionsListModel = {
      actions: [
        {
          id: 1,
          iconTooltip: {
            displayIcon: true,
            iconClass: 'pi pi-circle-fill',
            tooltipMessage: 'actions status',
            iconPosition: '',
          },
          actionName: 'Audit plan available',
          dueDate: '03.10.2024',
          highPriority: false,
          entityType: 'Audit',
          entityId: '1',
          message:
            'Your auditor has shared the audit plan for ISO 9001:2017 and ISO 14001:2018.',
          service: 'ISO 9001:2018',
          site: 'Opentech | Opentech',
          actions: [
            {
              actionType: 'redirect',
              iconClass: 'pi-angle-right',
              label: 'angle-right',
              url: '',
            },
          ],
          dateWithIcon: {
            displayIcon: true,
            iconClass: 'pi pi-info-circle',
            tooltipMessage: 'actions status',
            iconPosition: 'prefix',
          },
        },
        {
          id: 2,
          iconTooltip: {
            displayIcon: true,
            iconClass: 'pi pi-circle-fill',
            tooltipMessage: 'actions status',
            iconPosition: '',
          },
          actionName: 'Audit plan available',
          dueDate: '03.10.2024',
          message:
            'Your auditor has shared the audit plan for ISO 9001:2017 and ISO 14001:2018.',
          service: 'ISO 9001:2018',
          site: 'Opentech | Opentech',
          highPriority: false,
          entityType: 'Audit',
          entityId: '1',
          actions: [
            {
              actionType: 'redirect',
              iconClass: 'pi-angle-right',
              label: 'angle-right',
              url: '',
            },
          ],
          dateWithIcon: {
            displayIcon: true,
            iconClass: 'pi pi-info-circle',
            tooltipMessage: 'actions status',
            iconPosition: 'prefix',
          },
        },
      ],
    };
    jest
      .spyOn(actionsListServiceMock, 'getActionsList')
      .mockReturnValue(of(mockedActionListResponse));

    // Act
    store.dispatch(new LoadActionsDetails());

    actions$.pipe(ofActionSuccessful(LoadActionsDetails)).subscribe(() => {
      const actualActionListInState = store.selectSnapshot(
        (state) => state.actionsDetails.actions,
      );

      // Assert
      expect(actualActionListInState).toEqual(mockedActionListResponse);
    });
  });

  test('should load getActionFilterCategories into state', () => {
    // Arrange
    const mockCategoryFilterResponse: ActionFilterDataModel = {
      data: [
        {
          label: 'category1',
          value: 1,
        },
      ],
    };

    jest
      .spyOn(actionsListServiceMock, 'getActionFilterCategories')
      .mockReturnValue(of(mockCategoryFilterResponse));

    // Act
    store.dispatch(new LoadActionsFilterList());

    actions$.pipe(ofActionSuccessful(LoadActionsFilterList)).subscribe(() => {
      const actualActionListInState = store.selectSnapshot(
        (state) => state.categoryFilter,
      );

      // Assert
      expect(actualActionListInState).toEqual(mockCategoryFilterResponse);
    });
  });
});
