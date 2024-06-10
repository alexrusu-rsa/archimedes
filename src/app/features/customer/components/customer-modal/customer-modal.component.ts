import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Customer } from 'src/app/shared/models/customer';
import { Icons } from 'src/app/shared/models/icons.enum';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCard,
    MatCardTitle,
    MatLabel,
    MatIcon,
    MatHint,
    MatFormField,
    MatButton,
    MatIconButton,
    MatInput,
    MatSlideToggle,
    KeyValuePipe,
  ],
  styles: [
    `
      .mat-dialog-content
        overflow: unset
    `,
  ],
  templateUrl: './customer-modal.component.html',
})
export class CustomerModalComponent implements OnInit {
  protected readonly icons = Icons;
  protected customerForm: FormGroup;
  protected validators = Validators;

  constructor(
    public dialogRef: MatDialogRef<CustomerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public customer: Customer,
    private formBuilder: FormBuilder
  ) {
    this.customerForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      customerCUI: ['', Validators.required],
      customerReg: ['', Validators.required],
      customerAddress: ['', Validators.required],
      customerCity: ['', Validators.required],
      customerCountry: ['', Validators.required],
      customerDirectorName: [''],
      customerDirectorEmail: [''],
      customerDirectorTel: [''],
      shortName: [''],
      internal: [false],
      IBANRO: [''],
      IBANEUR: [''],
      romanianCompany: [false],
      VAT: [false],
      swift: [''],
    });

    this.customerForm.markAllAsTouched();
  }

  ngOnInit(): void {
    if (this.customer) {
      const { id, ...customerWithoutId } = this.customer;
      this.customerForm.setValue(customerWithoutId);
    }
  }

  submit() {
    if (this.customerForm.valid && !this.customer)
      this.dialogRef.close(this.customerForm.value);
    if (this.customerForm.valid && this.customer)
      this.dialogRef.close({
        ...this.customerForm.value,
        id: this.customer.id,
      });
  }
}
