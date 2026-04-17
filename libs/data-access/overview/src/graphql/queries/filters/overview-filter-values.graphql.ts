import { gql } from 'apollo-angular';

export const OVERVIEW_FILTER_QUERY = gql`
  query FEoverviewCompanyServiceSiteFilter {
    overviewCompanyServiceSiteFilter {
      data {
        companyId
        serviceId
        siteId
        __typename
      }
      isSuccess
      message
      errorCode
      __typename
    }
  }
`;
