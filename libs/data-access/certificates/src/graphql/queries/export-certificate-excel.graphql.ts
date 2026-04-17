import { gql } from 'apollo-angular';

export const EXPORT_CERTIFICATE_EXCEL_QUERY = gql`
  query ExportCertificatesExcel($filters: Input_CertificatesListFilterRequest) {
    exportCertificates(filters: $filters) {
      isSuccess
      data
      errorCode
      message
    }
  }
`;
