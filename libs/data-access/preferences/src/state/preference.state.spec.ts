import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FilterOperator } from 'primeng/api';
import { of } from 'rxjs';

import {
  FilterMode,
  ObjectName,
  ObjectType,
  PageName,
} from '@customer-portal/shared';

import { PreferenceDto } from '../dtos';
import { PreferenceModel } from '../models';
import { PreferenceService } from '../services';
import { LoadPreference, SavePreference } from './preference.actions';
import { PreferenceState } from './preference.state';

describe('PreferenceState', () => {
  let store: Store;

  const preferenceServiceMock = {
    savePreferences: jest.fn(),
    getPreference: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([PreferenceState])],
      providers: [
        {
          provide: PreferenceService,
          useValue: preferenceServiceMock,
        },
      ],
    });

    store = TestBed.inject(Store);
  });

  test('should request preferences and save transformed result into the state', () => {
    // Arrange
    const mockedGetPreferenceResponse = {
      isSuccess: true,
      data: {
        pageName: 'AuditList',
        objectType: 'Grid',
        objectName: 'Audits',
        preferenceDetail:
          '{"filters":{"auditNumber":[{"value":[{"label":"607389","value":"607389"},{"label":"608201","value":"608201"}],"matchMode":"in","operator":"and"}],"status":[{"matchMode":"in","operator":"and","value":null}],"service":[{"matchMode":"in","operator":"and","value":[{"label":"ISO 14001:2015","value":"ISO 14001:2015"}]}],"site":[{"matchMode":"in","operator":"and","value":null}],"city":[{"matchMode":"in","operator":"and","value":null}],"type":[{"matchMode":"in","operator":"and","value":null}],"startDate":[{"matchMode":"dateAfter","operator":"and","value":null}],"endDate":[{"matchMode":"dateAfter","operator":"and","value":null}],"leadAuthor":[{"matchMode":"in","operator":"and","value":null}]},"rowsPerPage":10}',
      },
    };

    jest
      .spyOn(preferenceServiceMock, 'getPreference')
      .mockReturnValueOnce(of(mockedGetPreferenceResponse));
    const expectedPreferencesInState = [
      {
        data: {
          filters: {
            auditNumber: [
              {
                value: [
                  {
                    label: '607389',
                    value: '607389',
                  },
                  {
                    label: '608201',
                    value: '608201',
                  },
                ],
                matchMode: 'in',
                operator: 'and',
              },
            ],
            status: [
              {
                matchMode: 'in',
                operator: 'and',
                value: null,
              },
            ],
            service: [
              {
                matchMode: 'in',
                operator: 'and',
                value: [
                  {
                    label: 'ISO 14001:2015',
                    value: 'ISO 14001:2015',
                  },
                ],
              },
            ],
            site: [
              {
                matchMode: 'in',
                operator: 'and',
                value: null,
              },
            ],
            city: [
              {
                matchMode: 'in',
                operator: 'and',
                value: null,
              },
            ],
            type: [
              {
                matchMode: 'in',
                operator: 'and',
                value: null,
              },
            ],
            startDate: [
              {
                matchMode: 'dateAfter',
                operator: 'and',
                value: null,
              },
            ],
            endDate: [
              {
                matchMode: 'dateAfter',
                operator: 'and',
                value: null,
              },
            ],
            leadAuthor: [
              {
                matchMode: 'in',
                operator: 'and',
                value: null,
              },
            ],
          },
          rowsPerPage: 10,
        },
        objectName: 'Audits',
        objectType: 'Grid',
        pageName: 'AuditList',
      },
    ];

    // Act
    store.dispatch(
      new LoadPreference(
        PageName.AuditList,
        ObjectName.Audits,
        ObjectType.Grid,
      ),
    );

    const actualPreferencesInState = store.selectSnapshot(
      (state) => state.preferences.preferenceItems,
    );

    // Assert
    expect(actualPreferencesInState).toEqual(expectedPreferencesInState);
  });

  test('should request saving preferences', () => {
    // Arrange
    const preferenceToSave: PreferenceModel = {
      pageName: 'AuditList',
      objectName: 'Audits',
      objectType: 'Grid',
      data: {
        filters: {
          auditNumber: [
            {
              value: [
                {
                  label: '607389',
                  value: '607389',
                },
                {
                  label: '608201',
                  value: '608201',
                },
              ],
              matchMode: FilterMode.In,
              operator: FilterOperator.AND,
            },
          ],
          status: [
            {
              matchMode: FilterMode.In,
              operator: FilterOperator.AND,
              value: null,
            },
          ],
          service: [
            {
              matchMode: FilterMode.In,
              operator: FilterOperator.AND,
              value: [
                {
                  label: 'ISO 14001:2015',
                  value: 'ISO 14001:2015',
                },
              ],
            },
          ],
          site: [
            {
              matchMode: FilterMode.In,
              operator: FilterOperator.AND,
              value: null,
            },
          ],
          city: [
            {
              matchMode: FilterMode.In,
              operator: FilterOperator.AND,
              value: null,
            },
          ],
          type: [
            {
              matchMode: FilterMode.In,
              operator: FilterOperator.AND,
              value: null,
            },
          ],
          startDate: [
            {
              matchMode: FilterMode.DateAfter,
              operator: FilterOperator.AND,
              value: null,
            },
          ],
          endDate: [
            {
              matchMode: FilterMode.DateAfter,
              operator: FilterOperator.AND,
              value: null,
            },
          ],
          leadAuthor: [
            {
              matchMode: FilterMode.In,
              operator: FilterOperator.AND,
              value: null,
            },
          ],
        },
        rowsPerPage: 10,
      },
    };
    const expectedDto: PreferenceDto = {
      objectName: 'Audits',
      objectType: 'Grid',
      pageName: 'AuditList',
      preferenceDetail:
        '{"filters":{"auditNumber":[{"value":[{"label":"607389","value":"607389"},{"label":"608201","value":"608201"}],"matchMode":"in","operator":"and"}],"status":[{"matchMode":"in","operator":"and","value":null}],"service":[{"matchMode":"in","operator":"and","value":[{"label":"ISO 14001:2015","value":"ISO 14001:2015"}]}],"site":[{"matchMode":"in","operator":"and","value":null}],"city":[{"matchMode":"in","operator":"and","value":null}],"type":[{"matchMode":"in","operator":"and","value":null}],"startDate":[{"matchMode":"dateAfter","operator":"and","value":null}],"endDate":[{"matchMode":"dateAfter","operator":"and","value":null}],"leadAuthor":[{"matchMode":"in","operator":"and","value":null}]},"rowsPerPage":10}',
    };

    // Act
    store.dispatch(new SavePreference(preferenceToSave));

    // Assert
    expect(preferenceServiceMock.savePreferences).toHaveBeenCalledWith(
      expectedDto,
    );
  });
});
