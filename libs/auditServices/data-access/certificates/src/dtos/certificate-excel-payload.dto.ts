export interface CertificateExcelPayloadDto {
  filters: {
    certificateNumber: string[] | null;
    companyName: string[] | null;
    status: string[] | null;
    issuedDate: string[] | null;
    validUntil: string[] | null;
    city: string[] | null;
    site: string[] | null;
    service: string[] | null;
  };
}
