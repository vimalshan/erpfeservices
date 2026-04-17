import { gql } from 'apollo-angular';

export const CO_BROWSING_COMPANY_LIST = gql`
  query ViewAllCompanyList {
    viewAllCompanyList {
      data {
        companyName
        id
      }
      isSuccess
      message
      errorCode
    }
  }
`;
