import { gql } from 'apollo-angular';

export const CERTIFICATE_SITES_LIST_QUERY = gql`
  query GetCertificateSites($certificateId: Int!) {
    sitesInScope(certificateId: $certificateId) {
      data {
        siteNameInPrimaryLanguage
        siteNameInSecondaryLanguage
        siteAddressInPrimaryLanguage
        siteAddressInSecondaryLanguage
        siteScopeInPrimaryLanguage
        siteScopeInSecondaryLanguage
        isPrimarySite
      }
      isSuccess
      message
      errorCode
    }
  }
`;
