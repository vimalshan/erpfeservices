import { gql } from 'apollo-angular';

export const EXPORT_INVOICES_EXCEL_QUERY = gql`
  query ExportInvoicesExcel($filters: FinanceListFilterRequestInput) {
    ExportFinancials(filters: $filters) {
      isSuccess
      data
      errorCode
      message
    }
  }
`;
