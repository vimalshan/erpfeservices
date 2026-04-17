import { gql } from 'apollo-angular';

export const SETTINGS_MEMBERS_PERMISSIONS_QUERY = gql`
  query GetSettingsMembersPermissions(
    $accountSuaadhyaId: String
    $memberEmail: String
  ) {
    getUserPermissions(accountSuaadhyaId: $accountSuaadhyaId, memberEmail: $memberEmail) {
      data {
        companies {
          companyId
          companyName
          hasParentId
          parentId
          services {
            countries {
              cities {
                cityName
                sites {
                  siteId
                  siteName
                }
              }
              countryId
              countryName
            }
            serviceId
            serviceName
          }
        }
        userId
      }
      errorCode
      isSuccess
      message
    }
  }
`;
