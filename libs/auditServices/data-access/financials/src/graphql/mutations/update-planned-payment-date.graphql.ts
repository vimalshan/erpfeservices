import { gql } from 'apollo-angular';

export const UPDATE_PLANNED_PAYMENT_DATE_MUTATION = gql`
  mutation UpdatePlannedPaymentDate(
    $invoiceNumber: [String!]!
    $plannedDates: DateTime!
  ) {
    UpdatePlannedPaymentDate(
      invoiceNumber: $invoiceNumber
      planpaymentDate: $plannedDates
    ) {
      data
      errorCode
      isSuccess
      message
    }
  }
`;
