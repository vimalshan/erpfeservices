import { gql } from 'apollo-angular';

export const DOWNLOAD_CERTIFICATION_MARK_QUERY = gql`
  query DownloadCertMark($downloadLink: String!) {
    downloadCertMark(downloadLink: $downloadLink) {
      data
      isSuccess
      message
      errorCode
    }
  }
`;
