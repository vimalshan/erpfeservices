import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { ObjectName, ObjectType, PageName } from '@customer-portal/shared';

import { PreferenceDto } from '../dtos';
import { GET_PREFERENCE_QUERY, SAVE_PREFERENCES_MUTATION } from '../graphql';
import { PreferenceService } from './preference.service';

describe('PreferenceService', () => {
  let service: PreferenceService;
  const apolloMock: Partial<Apollo> = {
    mutate: jest.fn(),
    query: jest.fn(),
    use: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    service = new PreferenceService(apolloMock as Apollo);
  });

  test('should save preferences', (done) => {
    // Arrange
    const preferenceRequest: PreferenceDto = {
      objectName: ObjectName.Certificates,
      objectType: ObjectType.Grid,
      pageName: PageName.CertificateList,
      preferenceDetail:
        '{"filters":{"auditNumber":[{"matchMode":"in","operator":"and","value":null}],"status":[{"matchMode":"in","operator":"and","value":[{"label":"Completed","value":"Completed"}]}],"service":[{"matchMode":"in","operator":"and","value":null}],"site":[{"matchMode":"in","operator":"and","value":null}],"city":[{"matchMode":"in","operator":"and","value":null}],"type":[{"matchMode":"in","operator":"and","value":null}],"startDate":[{"matchMode":"dateAfter","operator":"and","value":null}],"endDate":[{"matchMode":"dateAfter","operator":"and","value":null}],"leadAuthor":[{"matchMode":"in","operator":"and","value":null}]},"rowsPerPage":10,"columns":[],"showDefaultColumnsButton":false}',
    };

    const mockResponse = {
      data: {
        savePreferences: true,
      },
    };

    apolloMock.mutate = jest.fn().mockReturnValue(of(mockResponse));

    // Act
    service.savePreferences(preferenceRequest).subscribe((result) => {
      // Assert
      expect(apolloMock.mutate).toHaveBeenCalledWith({
        mutation: SAVE_PREFERENCES_MUTATION,
        variables: {
          preferenceRequest,
        },
      });
      expect(result).toBe(mockResponse);
      done();
    });
  });

  test('should fetch and map preferences', (done) => {
    // Arrange
    const objectType = ObjectType.Grid;
    const objectName = ObjectName.Audits;
    const pageName = PageName.AuditDetails;
    const preferences = {
      key1: 'value1',
      key2: 'value2',
    };

    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: {
          preferences,
        },
      }),
    );

    // Act
    service
      .getPreference(objectType, objectName, pageName)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: GET_PREFERENCE_QUERY,
          variables: {
            objectType,
            objectName,
            pageName,
          },
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(preferences);
        done();
      });
  });
});
