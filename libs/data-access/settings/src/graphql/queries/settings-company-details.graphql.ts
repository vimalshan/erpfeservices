import { gql } from 'apollo-angular';

export const SETTINGS_COMPANY_DETAILS_QUERY = gql`
  query GetSettingsCompanyDetails {
    userCompanyDetails {
      data {
        userStatus
        isAdmin
        parentCompany {
          accountId
          address
          city
          country
          countryId
          isSerReqOpen
          organizationName
          poNumberRequired
          vatNumber
          zipCode
        }
        legalEntities {
          accountId
          address
          city
          country
          countryCode
          countryId
          isSerReqOpen
          organizationName
          poNumberRequired
          vatNumber
          zipCode
          accountDNVId
        }
      }
      isSuccess
      errorCode
      message
    }
  }
`;
