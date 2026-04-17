import { gql } from 'apollo-angular';

export const SETTINGS_ADMIN_LIST_QUERY = gql`
  query GetSettingsAdminList($accountSuaadhyaId: String) {
    adminList(accountSuaadhyaId: $accountSuaadhyaId) {
      data {
        name
        email
        userStatus
        isCurrentUser
        canDelete
        canManagePermissions
        companies {
          companyId
          companyName
        }
      }
      isSuccess
      message
      errorCode
    }
  }
`;
