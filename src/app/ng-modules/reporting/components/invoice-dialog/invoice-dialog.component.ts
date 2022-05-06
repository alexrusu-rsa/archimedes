import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { InvoiceDataWrapper } from 'src/app/models/invoice-data-wrapper';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['./invoice-dialog.component.sass'],
})
export class InvoiceDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public invoiceDataWrapper: InvoiceDataWrapper,
    public dialogRef: MatDialogRef<InvoiceDialogComponent>,
    private customerService: CustomerService
  ) {}

  customerId?: string;
  invoiceNumber?: string;
  selectedMonthYear?: string;
  downloadXLSX() {
    if (this.customerId && this.invoiceNumber && this.selectedMonthYear)
      this.customerService
        .getCustomerInvoiceXLSX(
          this.customerId,
          this.invoiceNumber,
          this.selectedMonthYear
        )
        .subscribe((response: any) => {
          window.location.href = response.url;
        });
    this.dialogRef.close();
  }

  downloadPDF() {
    if (this.customerId && this.invoiceNumber && this.selectedMonthYear)
      this.customerService
        .getCustomerInvoicePDF(
          this.customerId,
          this.invoiceNumber,
          this.selectedMonthYear
        )
        .subscribe((response: any) => {
          window.location.href = response.url;
        });
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.selectedMonthYear =
      this.invoiceDataWrapper.month + this.invoiceDataWrapper.year;
    this.customerId = this.invoiceDataWrapper.customerId;
  }
}
