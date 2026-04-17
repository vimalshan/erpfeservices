export interface FindingDetailsModel {
  findingNumber: string;
  header: FindingDetailsHeader;
  primaryLanguageDescription: FindingDetailsDescription;
  secondaryLanguageDescription: FindingDetailsDescription;
}

export interface FindingDetailsHeader {
  site: string;
  city: string;
  openDate: string;
  dueDate: string;
  closeDate: string;
  acceptedDate: string;
  auditor: string;
  auditType: string;
  auditNumber: string;
  services: string;
  status: string;
}

export interface FindingDetailsDescription {
  category: string;
  description: string;
  clause: string;
  focusArea: string;
  language: string;
  isPrimaryLanguage: boolean;
  isSelected: boolean;
  title: string;
}
