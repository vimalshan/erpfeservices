import { gql } from 'apollo-angular';

export const UPDATE_NOTIFICATION_READ_STATUS = gql`
  mutation MarkNotificationRead($notificationId: Int!, $userId: Int!) {
    markNotificationRead(notificationId: $notificationId, userId: $userId) {
      id
      title
      isRead
      readDate
    }
  }
`;
