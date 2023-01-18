import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { InvoiceDataWrapper } from 'src/app/models/invoice-data-wrapper';
import { InvoiceDialogOnCloseResult } from 'src/app/models/invoice-dialog-onclose-result';
import { CustomerService } from 'src/app/services/customer-service/customer.service';
import { StringLiteral } from 'typescript';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['./invoice-dialog.component.sass'],
})
export class InvoiceDialogComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA) public invoiceDataWrapper: InvoiceDataWrapper,
    public dialogRef: MatDialogRef<InvoiceDialogComponent>,
    private customerService: CustomerService,
    public datepipe: DatePipe
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
  customerShortname?: string;
  selectedDate?: Date;
  romanianCustomer?: boolean;

  dateFormatted?: number;

  downloadXLSX() {
    if (this.checkAbleToRequestInvoice())
      if (this.customerId && this.invoiceNumber && this.selectedMonthYear)
        this.xlsxSub = this.customerService
          .getCustomerInvoiceXLSX(
            this.customerId,
            this.invoiceNumber.value,
            this.invoiceDataWrapper.month,
            this.invoiceDataWrapper.year,
            Number(this.euroExchange?.value),
            this.dateFormatted!
          )
          .subscribe((response: any) => {
            this.dialogRef.close(<InvoiceDialogOnCloseResult>{
              response: response,
              customerName: this.customerName,
              invoiceNumber: this.invoiceNumber?.value,
              customerShortName: this.customerShortname,
            });
          });
  }

  downloadPDF() {
    if (!this.romanianCustomer) {
      this.euroExchange?.setValue('1.00');
    }
    if (this.checkAbleToRequestInvoice())
      if (this.customerId && this.invoiceNumber && this.selectedMonthYear) {
        this.pdfSub = this.customerService
          .getCustomerInvoicePDF(
            this.customerId,
            this.invoiceNumber.value,
            this.invoiceDataWrapper.month,
            this.invoiceDataWrapper.year,
            Number(this.euroExchange?.value),
            this.dateFormatted!
          )
          .subscribe((response: any) => {
            this.dialogRef.close(<InvoiceDialogOnCloseResult>{
              response: response,
              customerName: this.customerName,
              invoiceNumber: this.invoiceNumber?.value,
              customerShortName: this.customerShortname,
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

  OnDateChange(event?: any) {
    this.selectedDate = event;
    this.dateFormatted = event.getTime();
  }

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.OnDateChange(this.selectedDate);
    if (this.invoiceDataWrapper.customerShortName) {
      this.customerShortname = this.invoiceDataWrapper.customerShortName;
    }
    this.selectedMonthYear =
      this.invoiceDataWrapper.month + this.invoiceDataWrapper.year;
    this.customerId = this.invoiceDataWrapper.customerId;
    this.customerName = this.invoiceDataWrapper.customerName;
    this.romanianCustomer = this.invoiceDataWrapper.customerRomanian;

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
