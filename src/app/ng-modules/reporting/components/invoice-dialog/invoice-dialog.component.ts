import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { InvoiceDataWrapper } from 'src/app/models/invoice-data-wrapper';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['./invoice-dialog.component.sass'],
})
export class InvoiceDialogComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA) public invoiceDataWrapper: InvoiceDataWrapper,
    public dialogRef: MatDialogRef<InvoiceDialogComponent>,
    private customerService: CustomerService
  ) {}

  customerId?: string;
  invoiceNumber?: string;
  selectedMonth?: string;
  selectedYear?: string;
  selectedMonthYear?: string;
  pdfSub?: Subscription;
  xlsxSub?: Subscription;

  downloadXLSX() {
    if (this.customerId && this.invoiceNumber && this.selectedMonthYear)
      this.xlsxSub = this.customerService
        .getCustomerInvoiceXLSX(
          this.customerId,
          this.invoiceNumber,
          this.invoiceDataWrapper.month,
          this.invoiceDataWrapper.year
        )
        .subscribe((response: any) => {
          this.dialogRef.close(response);
        });
  }

  downloadPDF() {
    if (this.customerId && this.invoiceNumber && this.selectedMonthYear) {
      this.pdfSub = this.customerService
        .getCustomerInvoicePDF(
          this.customerId,
          this.invoiceNumber,
          this.invoiceDataWrapper.month,
          this.invoiceDataWrapper.yearg
        )
        .subscribe((response: any) => {
          this.dialogRef.close(response);
        });
    }
  }

  ngOnInit(): void {
    this.selectedMonthYear =
      this.invoiceDataWrapper.month + this.invoiceDataWrapper.year;
    this.customerId = this.invoiceDataWrapper.customerId;
  }
  ngOnDestroy(): void {
    this.xlsxSub?.unsubscribe();
    this.pdfSub?.unsubscribe();
  }
}
