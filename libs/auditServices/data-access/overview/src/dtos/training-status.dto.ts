export interface TrainingStatusGraphResponseDto {
  message: string;
  isSuccess: boolean;
  data: TrainingStatusListDto;
}

export interface TrainingStatusListDto {
  trainingData: TrainingStatusDto[];
}

export interface TrainingStatusDto {
  trainingName: string;
  trainingStatus: string;
  trainingDueDate: string;
  trainingLocation: string;
}
