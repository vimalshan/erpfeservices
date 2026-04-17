import { EventAction, GridFileAction } from '@customer-portal/shared';

export interface InvoiceListItemModel {
  actions: GridFileAction[];
  amount: string;
  billingAddress: string;
  company: string;
  contactPerson: string;
  dueDate: string;
  eventActions: EventAction;
  invoiceId: string;
  issueDate: string;
  originalInvoiceNumber: string | null;
  plannedPaymentDate: string | null;
  referenceNumber: string;
  status: string;
  reportingCountry: string;
  projectNumber: string;
  accountDNVId: number;
}
