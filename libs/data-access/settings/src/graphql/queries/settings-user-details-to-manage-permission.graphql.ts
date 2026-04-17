import { gql } from 'apollo-angular';

export const SETTINGS_USER_DETAILS_TO_MANAGE_PERMISSION = gql`
  query GetUserDetailsTomanagePermission($memberEmail: String!) {
    getUserDetailsTomanagePermission(memberEmail: $memberEmail) {
      data {
        userId
        firstName
        lastName
        emailId
        jobTitle
        companies {
          companyId
          companyName
          hasParentId
          parentId
          isCompanySelected
          services {
            serviceId
            serviceName
            isServiceSelected
            countries {
              countryId
              countryName
              isCountrySelected
              cities {
                cityName
                isCitySelected
                sites {
                  siteId
                  siteName
                  isSiteSelected
                }
              }
            }
          }
        }
        accessArea {
          email
          roleId
          roleName
        }
      }
    }
  }
`;
