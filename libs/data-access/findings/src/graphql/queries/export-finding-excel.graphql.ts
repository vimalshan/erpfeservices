import { gql } from 'apollo-angular';

export const EXPORT_FINDING_EXCEL_QUERY = gql`
  query exportFindings($filters: Input_FindingListFilterRequest) {
    exportFindings(filters: $filters) {
      isSuccess
      data
      errorCode
      message
    }
  }
`;
