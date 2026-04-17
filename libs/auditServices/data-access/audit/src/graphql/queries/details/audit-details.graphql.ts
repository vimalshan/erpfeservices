import { gql } from 'apollo-angular';

export const AUDIT_DETAILS_QUERY = gql`
  query GetAuditDetails($auditId: Int!) {
    auditDetails(auditId: $auditId) {
      data {
        auditId
        auditorTeam
        endDate
        leadAuditor
        services
        siteAddress
        siteName
        startDate
        status
      }
      errorCode
      isSuccess
      message
    }
  }
`;
