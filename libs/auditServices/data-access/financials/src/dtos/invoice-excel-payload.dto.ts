export interface InvoiceExcelPayloadDto {
  filters: {
    invoice: number[] | null;
    status: string[] | null;
    billingAddress: string[] | null;
    amount: string[] | null;
    due: string[] | null;
    plannedPaymentDate: string[] | null;
    referenceNumber: string[] | null;
    issueDate: string[] | null;
    contactPerson: string[] | null;
    company: string[] | null;
    originalInvoice: string[] | null;
  };
}
