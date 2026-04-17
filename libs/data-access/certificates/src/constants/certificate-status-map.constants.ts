import { StatesClasses } from '@customer-portal/shared';

export const enum CertificateStatus {
  Expired = 'Expired Date',
  InProgress = 'In progress',
  Issued = 'Issued',
  OutstandingInvoices = 'Outstanding invoices',
  Suspended = 'Suspended',
  Withdrawn = 'Withdrawn',
}

export const CERTIFICATE_STATUS_MAP: Record<string, string> = {
  [CertificateStatus.Expired.toLowerCase()]: StatesClasses.PewterGray,
  [CertificateStatus.InProgress.toLowerCase()]: StatesClasses.SunshineYellow,
  [CertificateStatus.Issued.toLowerCase()]: StatesClasses.ForestGreen,
  [CertificateStatus.OutstandingInvoices.toLowerCase()]:
    StatesClasses.CrimsonFlame,
  [CertificateStatus.Suspended.toLowerCase()]: StatesClasses.GraphOrange,
  [CertificateStatus.Withdrawn.toLowerCase()]: StatesClasses.SummerSky,
};
