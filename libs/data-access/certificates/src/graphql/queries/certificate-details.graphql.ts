import { gql } from 'apollo-angular';

export const GET_CERTIFICATE_DETAILS_QUERY = gql`
  query GetCertificateDetails($certificateId: Int!) {
    viewCertificateDetails(certificateId: $certificateId) {
      isSuccess
      data {
        certificateId
        certificateNumber
        creationDate
        issuedDate
        newCertificateId
        primaryLanguage
        revisionNumber
        scopeInAdditionalLanguages {
          language
          scope
        }
        scopeInPrimaryLanguage
        scopeInSecondaryLanguage
        secondaryLanguage
        services
        siteAddressInPrimaryLanguage
        siteNameInPrimaryLanguage
        status
        suspendedDate
        validUntilDate
        withdrawnDate
        qRCodeLink
        projectNumber
        reportingCountry
        accountDNVId
      }
    }
  }
`;
