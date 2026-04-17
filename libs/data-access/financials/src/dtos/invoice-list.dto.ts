export interface InvoiceListDto {
  data: {
    items: InvoiceListItemDto[];
  };
  isSuccess: boolean;
  message: string;
}

export interface InvoiceListItemDto {
  amount: string;
  billingAddress: string;
  company: string;
  contactPerson: string;
  dueDate: string;
  invoice: string;
  issueDate: string;
  originalInvoice: string | null;
  plannedPaymentDate: string | null;
  referenceNumber: string;
  status: string;
  reportingCountry: string;
  projectNumber: string;
  accountDNVId: number;
}
