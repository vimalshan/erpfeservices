import { TrainingStatusDto, TrainingStatusGraphResponseDto } from '../../dtos';
import { TrainingStatusListWithStatus } from '../../models';

export class TrainingStatusMapper {
  static mapToTrainingStatusList(
    trainingStatus: TrainingStatusGraphResponseDto,
  ): TrainingStatusListWithStatus {
    const trainingData = trainingStatus?.data?.trainingData;

    if (trainingStatus?.isSuccess) {
      return {
        data:
          trainingData?.map((training: TrainingStatusDto) => ({
            trainingName: training.trainingName,
            status: training.trainingStatus,
            dueDate: training.trainingDueDate,
            location: training.trainingLocation,
            imageUrl: 'assets/external-apps/boostAudit.png',
          })) ?? [],
        isSuccess: true,
        message: 'success',
      };
    }

    return {
      data: [],
      isSuccess: false,
      message: 'Training status failed to load',
    };
  }
}
