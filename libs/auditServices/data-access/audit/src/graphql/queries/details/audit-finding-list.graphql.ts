import { gql } from 'apollo-angular';

export const AUDIT_FINDING_LIST_QUERY = gql`
  query GetAuditFindingList($auditId: Int!) {
    viewFindings(auditId: $auditId) {
      data {
        acceptedDate
        auditId
        category
        companyId
        closedDate
        dueDate
        findingNumber
        findingsId
        openDate
        services
        siteId
        status
        title
      }
      errorCode
      isSuccess
      message
    }
  }
`;
