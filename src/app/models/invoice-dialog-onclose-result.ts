export interface InvoiceDialogOnCloseResult {
  response: unknown;
  customerName?: string;
  invoiceNumber?: number;
  customerShortName?: string;
  downloadStart: boolean;
}
