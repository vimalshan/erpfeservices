import { gql } from 'apollo-angular';

export const SETTINGS_COMPANY_DETAILS_MUTATION = gql`
  mutation UpdateCompanyDetails(
    $updateCompanyRequest: Input_CompanyDetailsUpdateQuery
  ) {
    updateCompanyDetails(updateCompanyRequest: $updateCompanyRequest) {
      data {
        email
        accountId
        address
        city
        countryId
        zipCode
        vatNumber
        poNumberRequired
      }
      isSuccess
      message
      errorCode
    }
  }
`;
