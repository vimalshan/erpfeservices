import { gql } from 'apollo-angular';

export const OVERVIEW_FINANCIAL_STATUS_QUERY = gql`
  query GetOverviewFinancialStatus {
    getWidgetforFinancials {
      isSuccess
      message
      errorCode
      data {
        financialStatus
        financialCount
        financialpercentage
      }
    }
  }
`;
