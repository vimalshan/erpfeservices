import { gql } from 'apollo-angular';

export const AUDIT_LIST_QUERY = gql`
  query GetAuditList {
    viewAudits {
      data {
        auditId
        sites
        services
        companyId
        status
        startDate
        endDate
        leadAuditor
        type
      }
      isSuccess
      message
      errorCode
    }
  }
`;
