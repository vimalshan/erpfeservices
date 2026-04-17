import { gql } from 'apollo-angular';

export const SETTINGS_MEMBERS_PERMISSIONS_QUERY = gql`
  query GetSettingsMembersPermissions(
    $accountDNVId: String
    $memberEmail: String
  ) {
    getUserPermissions(accountDNVId: $accountDNVId, memberEmail: $memberEmail) {
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
