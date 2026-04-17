import { gql } from 'apollo-angular';

export const EXPORT_SUBAUDIT_EXCEL_QUERY = gql`
  query ExportSubAudits(
    $auditId: Int!
    $filters: Input_ExportSubAuditsListRequest
  ) {
    exportSubAudits(auditId: $auditId, filters: $filters) {
      data
      isSuccess
      errorCode
      message
    }
  }
`;
