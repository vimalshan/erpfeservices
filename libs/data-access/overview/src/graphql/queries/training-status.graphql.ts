import { gql } from 'apollo-angular';

export const WIDGET_FOR_TRAINING_STATUS_QUERY = gql`
  query {
    widgetforTrainingStatus {
      isSuccess
      message
      errorCode
      data {
        trainingData {
          trainingName
          trainingStatus
          trainingDueDate
          trainingLocation
        }
      }
    }
  }
`;
