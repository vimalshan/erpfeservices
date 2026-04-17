export interface TrainingStatusListModel {
  trainingData: TrainingStatusModel[];
}

export interface TrainingStatusModel {
  trainingName: string;
  status: string;
  dueDate: string;
  location: string;
  imageUrl: string;
}

export interface TrainingStatusListWithStatus {
  data: TrainingStatusModel[];
  isSuccess: boolean;
  message: string;
}
