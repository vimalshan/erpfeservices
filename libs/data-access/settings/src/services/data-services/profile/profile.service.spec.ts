import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { PROFILE_QUERY } from '../../../graphql';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  const apolloMock: Partial<Apollo> = {
    mutate: jest.fn(),
    query: jest.fn(),
    use: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    service = new ProfileService(apolloMock as Apollo);
  });

  test('should fetch profile data', (done) => {
    // Arrange
    const userProfile = {
      data: {},
      isSuccess: false,
    };
    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: {
          userProfile,
        },
      }),
    );

    // Act
    service.getProfileData().subscribe((result) => {
      // Assert
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: PROFILE_QUERY,
        variables: {},
        fetchPolicy: 'no-cache',
      });
      expect(result).toBe(userProfile);
      done();
    });
  });
});
