import { gql } from 'apollo-angular';

export const FINDING_DETAILS_QUERY = gql`
  query GetFindingDetails($findingNumber: String!) {
    viewFindingDetails(findingNumber: $findingNumber) {
      isSuccess
      data {
        acceptedDate
        auditId
        auditors
        auditType
        closedDate
        dueDate
        findingNumber
        openedDate
        services
        sites {
          siteAddress
          siteName
        }
        status
      }
      errorCode
      message
    }
  }
`;
