import { gql } from 'apollo-angular';

export const INVOICE_LIST_QUERY = gql`
  query GetInvoiceList {
    InvoiceListPage {
      data {
        items {
          amount
          billingAddress
          company
          contactPerson
          dueDate
          invoice
          issueDate
          originalInvoice
          plannedPaymentDate
          referenceNumber
          status
          reportingCountry
          projectNumber
          accountDNVId
        }
      }
      isSuccess
      message
      errorCode
    }
  }
`;
