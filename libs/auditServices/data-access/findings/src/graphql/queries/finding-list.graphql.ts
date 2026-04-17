import { gql } from 'apollo-angular';

export const FINDING_LIST_QUERY = gql`
  query GetFindingList {
    viewFindings {
      data {
        findingsId
        findingNumber
        title
        status
        category
        response
        companyId
        openDate
        dueDate
        acceptedDate
        closedDate
        siteId
        services
        __typename
      }
      isSuccess
      message
      errorCode
      __typename
    }
  }
`;
