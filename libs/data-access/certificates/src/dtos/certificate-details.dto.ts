export interface CertificateDetailsDto {
  data: CertificateDetailsDescriptionDto;
  isSuccess: boolean;
}

export interface CertificateDetailsDescriptionDto {
  certificateId: number;
  certificateNumber: string;
  creationDate: string;
  documentMarks: DocumentMark[];
  issuedDate: string;
  newCertificateId: number | null;
  newRevisionNumber: number;
  primaryLanguage: string;
  revisionNumber: number;
  scopeInAdditionalLanguages: AdditionalScopeLanguage[];
  scopeInPrimaryLanguage: string;
  scopeInSecondaryLanguage: string;
  secondaryLanguage: string;
  services: string[];
  siteAddressInPrimaryLanguage: string;
  siteNameInPrimaryLanguage: string;
  status: string;
  suspendedDate: string;
  validUntilDate: string;
  withdrawnDate: string;
  qRCodeLink: string;
  projectNumber: string;
  reportingCountry: string;
  accountDNVId:number;
}

export interface AdditionalScopeLanguage {
  language: string;
  scope: string;
}
export interface DocumentMark {
  service: string;
  documentMarkUrls: DocumentMarkUrl[];
}

export interface DocumentMarkUrl {
  languageCode: string;
  url: string;
}
