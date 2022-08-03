import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  selectedMonth?: string;
  selectedYear?: string;
  selectedMonthYear?: string;
  invoiceNr?: string;
  euroExch?: string;
  pdfSub?: Subscription;
  xlsxSub?: Subscription;
  invoiceForm?: FormGroup;
  customerName?: string;
  getCustomerNameSub?: Subscription;

  downloadXLSX() {
    if (this.checkAbleToRequestInvoice())
      if (this.customerId && this.invoiceNumber && this.selectedMonthYear)
        this.xlsxSub = this.customerService
          .getCustomerInvoiceXLSX(
            this.customerId,
            this.invoiceNumber.value,
            this.invoiceDataWrapper.month,
            this.invoiceDataWrapper.year,
            Number(this.euroExchange?.value)
          )
          .subscribe((response: any) => {
            this.dialogRef.close({
              response: response,
              customerName: this.customerName,
              invoiceNumber: this.invoiceNumber?.value,
            });
          });
  }

  downloadPDF() {
    if (this.checkAbleToRequestInvoice())
      if (this.customerId && this.invoiceNumber && this.selectedMonthYear) {
        this.pdfSub = this.customerService
          .getCustomerInvoicePDF(
            this.customerId,
            this.invoiceNumber.value,
            this.invoiceDataWrapper.month,
            this.invoiceDataWrapper.year,
            Number(this.euroExchange?.value)
          )
          .subscribe((response: any) => {
            this.dialogRef.close({
              response: response,
              customerName: this.customerName,
              invoiceNumber: this.invoiceNumber?.value,
            });
          });
      }
  }

  checkAbleToRequestInvoice(): boolean {
    if (
      this.invoiceDataWrapper.month === null ||
      this.invoiceDataWrapper.month === undefined
    ) {
      return false;
    }
    if (!this.invoiceNumber?.valid || !this.euroExchange?.valid) return false;
    return true;
  }

  ngOnInit(): void {
    this.selectedMonthYear =
      this.invoiceDataWrapper.month + this.invoiceDataWrapper.year;
    this.customerId = this.invoiceDataWrapper.customerId;
    this.customerName = this.invoiceDataWrapper.customerName;
    this.invoiceForm = new FormGroup({
      invoiceNumber: new FormControl(this.invoiceNr, [
        Validators.required,
        Validators.pattern('[0-9]{1,4}'),
      ]),
      euroExchange: new FormControl(this.euroExch, [
        Validators.required,
        Validators.pattern('[0-9]{1}[.][0-9]{2,5}'),
      ]),
    });
  }
  ngOnDestroy(): void {
    this.xlsxSub?.unsubscribe();
    this.pdfSub?.unsubscribe();
  }

  get invoiceNumber() {
    return this.invoiceForm?.get('invoiceNumber');
  }
  get euroExchange() {
    return this.invoiceForm?.get('euroExchange');
  }
}
