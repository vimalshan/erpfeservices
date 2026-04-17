import { LanguageOption } from '@customer-portal/shared';

export interface CertificateDetailsModel {
  certificateId: number;
  certificateNumber: string;
  newCertificateId: number | null;
  accountDNVId: number;
  header: CertificateDetailsHeader;
}

export interface CertificateMarksModel {
  description: string;
  link: string;
}

export interface CertificateDetailsScope {
  language: string;
  content: string;
}

export interface CertificateDetailsHeader {
  creationDate: string;
  documentMarks: DocumentMark[];
  issuedDate: string;
  languages: CertificateLanguage[];
  newRevisionNumber: number;
  revisionNumber: number;
  scopes: CertificateScope[];
  services: string;
  siteAddress: string;
  siteName: string;
  status: string;
  suspendedDate: string;
  validUntilDate: string;
  withdrawnDate: string;
  qRCodeLink: string;
  projectNumber: string;
  reportingCountry: string;
}

export interface DocumentMark {
  service: string;
  documentMarkUrls: DocumentMarkUrl[];
}

export interface DocumentMarkUrl {
  languageCode: string;
  url: string;
}

export interface CertificateScope {
  language: string;
  content: string;
}
export interface CertificateLanguage {
  code: string;
  name: string;
  isPrimaryLanguage: boolean;
  isSelected: boolean;
}

export interface CertificateDownloadDialogData {
  label: string;
  isDownloadCertificationMark: boolean;
  languages: LanguageOption[] | undefined;
  serviceName: string;
}

export interface CertificateDownloadDialogSubmitData {
  isSubmitted: boolean;
  languageCode?: string;
}
