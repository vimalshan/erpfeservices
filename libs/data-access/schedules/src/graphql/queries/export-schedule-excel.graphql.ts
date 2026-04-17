import { gql } from 'apollo-angular';

export const EXPORT_SCHEDULE_EXCEL_QUERY = gql`
  query ExportAuditSchedules($filters: Input_AuditSchedulesFilterRequest) {
    exportAuditSchedules(filters: $filters) {
      data
      isSuccess
      message
      errorCode
    }
  }
`;
