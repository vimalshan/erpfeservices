import { gql } from 'apollo-angular';

export const AUDIT_SITES_LIST_QUERY = gql`
  query GetAuditSites($auditId: Int!) {
    viewSitesForAudit(auditId: $auditId) {
      data {
        siteName
        addressLine
        city
        country
        postCode
      }
      isSuccess
      message
      errorCode
    }
  }
`;
