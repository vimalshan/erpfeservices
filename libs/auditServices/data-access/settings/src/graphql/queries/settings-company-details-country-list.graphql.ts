import { gql } from 'apollo-angular';

export const SETTINGS_COMPANY_DETAILS_COUNTRY_LIST_QUERY = gql`
  query GetCountryList {
    getCountries {
      data {
        id
        countryName
        countryCode
        isActive
      }
      isSuccess
      errorCode
      message
    }
  }
`;
