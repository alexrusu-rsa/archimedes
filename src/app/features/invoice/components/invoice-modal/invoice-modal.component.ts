import { Invoice } from 'src/app/features/invoice/models/invoice.model';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  MatStep,
  MatStepContent,
  MatStepLabel,
  MatStepper,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { CustomerService } from 'src/app/features/customer/services/customer-service/customer.service';
import { InvoiceDialogOnCloseResult } from 'src/app/features/invoice/models/invoice-dialog-onclose-result';
import { SafePipe } from 'src/app/shared/pipes/safe/safe.pipe';
import { Icons } from 'src/app/shared/models/icons.enum';

@Component({
  selector: 'app-invoice-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatIconButton,
    MatButton,
    MatDialogTitle,
    MatDialogClose,
    MatDialogContent,
    MatDialogActions,
    MatStepper,
    MatStep,
    MatStepLabel,
    MatStepContent,
    MatStepperPrevious,
    TranslateModule,
    MatFormField,
    MatInputModule,
    MatHint,
    MatLabel,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    SafePipe,
  ],
  templateUrl: './invoice-modal.component.html',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceModalComponent implements OnInit {
  protected readonly icons = Icons;
  invoiceForm = new FormGroup({
    number: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{1,4}'),
    ]),
    exchangeRate: new FormControl(1, [Validators.required]),
    invoiceEmittingDay: new FormControl(new Date(), Validators.required),
  });
  protected pdfUrl: WritableSignal<string> = signal('');
  protected currentStep = signal(0);
  private service = inject(CustomerService);
  protected translateService = inject(TranslateService);
  private dialogRef = inject(MatDialogRef<InvoiceModalComponent>);
  protected invoice: Invoice = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    if (this.invoice.number) {
      this.invoiceForm.patchValue({
        number: this.invoice.number,
      });
    }
  }
  onSubmit(stepper: MatStepper) {
    this.service
      .getCustomerInvoicePDF(
        this.invoice.project.id,
        this.invoiceForm.controls.number.value,
        this.invoice.month,
        this.invoice.year,
        this.invoiceForm.controls.exchangeRate.value,
        this.invoiceForm.controls.invoiceEmittingDay.value.getTime(),
        this.invoice.project.invoiceTerm
      )
      .subscribe(({ body }) => {
        const url = URL.createObjectURL(body);
        this.pdfUrl.set(url);
        stepper.selectedIndex += 1;
      });
  }

  onDownload() {
    this.dialogRef.close(<InvoiceDialogOnCloseResult>{
      blobUrl: this.pdfUrl(),
      invoiceName: this.invoice.customer.romanianCompany
        ? `${this.translateService.instant('invoice.dialog.annex')}${
            this.invoiceForm?.controls?.number?.value
          }-${
            this.invoice.customer.shortName || this.invoice.customer.name
          }.pdf`
        : `${this.invoice.series}${this.invoiceForm.controls.number.value}-${
            this.invoice.customer.shortName || this.invoice.customer.name
          }.pdf`,
      downloadStart: true,
    });
  }
}
