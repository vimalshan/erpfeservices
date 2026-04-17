import { gql } from 'apollo-angular';

export const EXPORT_AUDIT_EXCEL_QUERY = gql`
  query ExportAuditsExcel($filters: Input_AuditListFilterRequest) {
    exportAudits(filters: $filters) {
      isSuccess
      data
      errorCode
      message
    }
  }
`;
