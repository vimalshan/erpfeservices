import { gql } from 'apollo-angular';

export const CERTIFICATE_LIST_QUERY = gql`
  query GetCertificateList {
    certificates {
      data {
        certificateId
        certificateNumber
        companyId
        serviceIds
        siteIds
        status
        issuedDate
        validUntil
        revisionNumber
        __typename
      }
      isSuccess
      errorCode
      message
    }
  }
`;
