import { gql } from 'apollo-angular';

export const DOWNLOAD_INVOICES_QUERY = gql`
  query DownloadInvoice($invoiceNumber: [String!]!) {
    DownloadInvoice(invoiceNumber: $invoiceNumber) {
      isSuccess
      data {
        content
        fileName
        isZipped
      }
      errorCode
      message
    }
  }
`;
