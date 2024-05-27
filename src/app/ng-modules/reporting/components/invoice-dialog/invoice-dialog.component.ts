import { Icons } from 'src/app/models/icons.enum';
import { DatePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  Inject,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceDataWrapper } from '../../../../models/invoice-data-wrapper';
import { InvoiceDialogOnCloseResult } from '../../../../models/invoice-dialog-onclose-result';
import { CustomerService } from '../../../../services/customer-service/customer.service';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['./invoice-dialog.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class InvoiceDialogComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  icons = Icons;
  customerId?: string;
  selectedMonth?: string;
  selectedYear?: string;
  selectedMonthYear?: string;
  invoiceNr?: string;
  euroExch?: string;
  invoiceForm?: FormGroup;
  customerName?: string;
  customerShortname?: string;
  selectedDate?: Date;
  romanianCustomer?: boolean;
  pdfUrl?: string;
  isEditable = false;
  invoiceTitle?: string;
  dateFormatted?: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public invoiceDataWrapper: InvoiceDataWrapper,
    public dialogRef: MatDialogRef<InvoiceDialogComponent>,
    private customerService: CustomerService,
    public datepipe: DatePipe
  ) {}

  downloadXLSX() {
    if (this.checkAbleToRequestInvoice())
      if (this.customerId && this.invoiceNumber && this.selectedMonthYear)
        this.customerService
          .getCustomerInvoiceXLSX(
            this.customerId,
            this.invoiceNumber.value,
            this.invoiceDataWrapper.month,
            this.invoiceDataWrapper.year,
            Number(this.euroExchange?.value),
            this.dateFormatted!
          )
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((response: unknown) => {
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
        this.customerService
          .getCustomerInvoicePDF(
            this.customerId,
            this.invoiceNumber.value,
            this.invoiceDataWrapper.month,
            this.invoiceDataWrapper.year,
            Number(this.euroExchange?.value),
            this.dateFormatted!,
            this.invoiceDataWrapper.invoiceTerm!
          )
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((response: unknown) => {
            this.pdfUrl = URL.createObjectURL(response['body']);
            if (this.invoiceNumber && this.customerShortname) {
              this.invoiceTitle =
                this.invoiceDataWrapper.invoiceSeries +
                this.invoiceNumber.value +
                '-' +
                this.customerShortname +
                '.pdf';
            }
          });
      }
  }

  downloadInvoice() {
    if (!this.romanianCustomer) {
      this.euroExchange?.setValue('1.00');
    }
    if (this.checkAbleToRequestInvoice())
      if (this.customerId && this.invoiceNumber && this.selectedMonthYear) {
        this.customerService
          .getCustomerInvoicePDF(
            this.customerId,
            this.invoiceNumber.value,
            this.invoiceDataWrapper.month,
            this.invoiceDataWrapper.year,
            Number(this.euroExchange?.value),
            this.dateFormatted!
          )
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((response: unknown) => {
            this.dialogRef.close(<InvoiceDialogOnCloseResult>{
              response: response,
              customerName: this.customerName,
              invoiceNumber: this.invoiceNumber?.value,
              customerShortName: this.customerShortname,
              downloadStart: true,
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

  OnDateChange(event?: unknown) {
    this.selectedDate = event as Date;
    this.dateFormatted = (event as Date).getTime();
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
      invoiceEmitDate: new FormControl(this.selectedDate),
    });
  }

  get invoiceNumber() {
    return this.invoiceForm?.get('invoiceNumber');
  }
  get euroExchange() {
    return this.invoiceForm?.get('euroExchange');
  }
}
