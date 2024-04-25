export interface InvoiceDialogOnCloseResult {
  response: any;
  customerName?: string;
  invoiceNumber?: number;
  customerShortName?: string;
  downloadStart: boolean;
}
