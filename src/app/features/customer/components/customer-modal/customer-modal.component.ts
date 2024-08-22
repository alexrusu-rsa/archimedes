import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
  private dialogRef = inject(MatDialogRef<CustomerModalComponent>);
  private formBuilder = inject(FormBuilder);
  protected customer = inject(MAT_DIALOG_DATA);
  protected readonly icons = Icons;
  protected customerForm: FormGroup;
  protected validators = Validators;

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required],
      CUI: ['', Validators.required],
      Reg: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      directorName: [''],
      directorEmail: [''],
      directorTel: [''],
      shortName: [''],
      internal: [false],
      IBANRO: [''],
      IBANEUR: [''],
      romanianCompany: [false],
      VAT: [false],
      swift: [''],
    });

    if (this.customer) {
      const { id, ...customerWithoutId } = this.customer;
      this.customerForm.setValue(customerWithoutId);
    }
  }

  submit() {
    if (this.customerForm.invalid) return;

    if (this.customer)
      this.dialogRef.close({
        ...this.customerForm.value,
        id: this.customer.id,
      });

    if (!this.customer) this.dialogRef.close(this.customerForm.value);
  }
}
