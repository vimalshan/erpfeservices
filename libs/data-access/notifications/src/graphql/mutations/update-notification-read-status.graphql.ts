import { gql } from 'apollo-angular';

export const UPDATE_NOTIFICATION_READ_STATUS = gql`
  mutation UpdateNotificationReadStatus($noticationId: Int!) {
    updateNotificationReadStatus(noticationId: $noticationId) {
      data {
        statusMessage
        isSuccess
      }
      isSuccess
      message
      errorCode
    }
  }
`;
