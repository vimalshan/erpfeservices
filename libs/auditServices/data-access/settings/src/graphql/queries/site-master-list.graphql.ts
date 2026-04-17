import { gql } from 'apollo-angular';

export const SITE_MASTER_LIST = gql`
  query MasterSiteList {
    masterSiteList {
      isSuccess
      message
      errorCode
      data {
        id
        siteName
        companyId
        companyName
        city
        countryId
        countryName
        formattedAddress
        siteState
        siteZip
      }
    }
  }
`;
