import { gql } from 'apollo-angular';

export const SETTINGS_ADMIN_LIST_QUERY = gql`
  query GetSettingsAdminList($accountDNVId: String) {
    adminList(accountDNVId: $accountDNVId) {
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
