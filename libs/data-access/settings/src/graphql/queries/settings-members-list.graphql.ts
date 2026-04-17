import { gql } from 'apollo-angular';

export const SETTINGS_MEMBER_LIST_QUERY = gql`
  query GetSettingsMemberList($accountSuaadhyaId: String) {
    memberList(accountSuaadhyaId: $accountSuaadhyaId) {
      data {
        name
        email
        userStatus
        roles
        canDelete
        canManagePermissions
        companies {
          companyId
          companyName
        }
        services {
          serviceId
          serviceName
        }
        countries {
          countryId
          countryName
          cities {
            cityName
            sites {
              siteId
              siteName
            }
          }
        }
      }
      isSuccess
      message
      errorCode
    }
  }
`;
