import { UnreadActionsCountDto, UnreadActionsDto } from '../../dtos';
import { UnreadActionsCountMapperService } from './unread-actions-count-mapper.service';

describe('UnreadActionsCountMapperService', () => {
  test('should map dto to model with count', () => {
    // Arrange
    const mockedDto: UnreadActionsCountDto = {
      data: 20,
      errorCode: '0001',
      isSuccess: true,
      message: 'test message',
    };
    const mockedActionsDto: UnreadActionsDto = {
      actionsCount: mockedDto,
    };

    const expectedResult = { count: 20 };

    // Act
    const result =
      UnreadActionsCountMapperService.mapToUnreadActionsCountModel(
        mockedActionsDto,
      );

    // Assert
    expect(result).toEqual(expectedResult);
  });

  test('should map dto to model with count as 0 if dto or dto.data is null or undefined', () => {
    // Arrange
    const expectedResult = { count: 0 };

    const nullDataMockedDto: UnreadActionsCountDto = {
      data: null as unknown as number,
      errorCode: '0001',
      isSuccess: true,
      message: 'test message',
    };
    const nullUnreadActionsDto: UnreadActionsDto = {
      actionsCount: nullDataMockedDto,
    };

    const undefinedDataMockedDto: UnreadActionsCountDto = {
      data: undefined as unknown as number,
      errorCode: '0002',
      isSuccess: true,
      message: 'test message 2',
    };

    const undefinedActionsDto: UnreadActionsDto = {
      actionsCount: undefinedDataMockedDto,
    };

    // Act
    const nullDataResult =
      UnreadActionsCountMapperService.mapToUnreadActionsCountModel(
        nullUnreadActionsDto,
      );
    const undefinedDataResult =
      UnreadActionsCountMapperService.mapToUnreadActionsCountModel(
        undefinedActionsDto,
      );
    const nullDtoResult =
      UnreadActionsCountMapperService.mapToUnreadActionsCountModel(
        null as unknown as UnreadActionsDto,
      );
    const undefinedDtoResult =
      UnreadActionsCountMapperService.mapToUnreadActionsCountModel(
        undefined as unknown as UnreadActionsDto,
      );

    // Assert
    expect(nullDataResult).toEqual(expectedResult);
    expect(undefinedDataResult).toEqual(expectedResult);
    expect(nullDtoResult).toEqual(expectedResult);
    expect(undefinedDtoResult).toEqual(expectedResult);
  });
});
