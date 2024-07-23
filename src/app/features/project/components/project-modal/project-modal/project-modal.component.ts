import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardTitle } from '@angular/material/card';
import {
  MatNativeDateModule,
  MatOption,
  provideNativeDateAdapter,
} from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatLabel, MatHint, MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Icons } from 'src/app/shared/models/icons.enum';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    TranslateModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatLabel,
    MatIcon,
    MatHint,
    MatFormField,
    MatButton,
    MatIconButton,
    MatInputModule,
    MatSelect,
    MatDatepicker,
    MatOption,
    MatDatepickerToggle,
    MatNativeDateModule,
  ],
  styles: [
    `
      .mat-dialog-content
        overflow: unset
    `,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './project-modal.component.html',
})
export class ProjectModalComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ProjectModalComponent>);
  private formBuilder = inject(FormBuilder);
  protected data = inject(MAT_DIALOG_DATA);
  protected projectForm: FormGroup;
  protected validators = Validators;
  protected readonly icons = Icons;

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      contract: ['', Validators.required],
      invoiceTerm: ['', Validators.required],
      dueDate: new FormControl(new Date(), Validators.required),
      contractSignDate: new FormControl(new Date(), Validators.required),
      customer: ['', Validators.required],
    });

    if (this.data?.project) {
      this.projectForm.patchValue(this.data?.project);
      const selectedCustomer = this.data.customers.find(
        (customer) => customer.id === this.data.project.customer.id
      );

      this.projectForm.get('customer').setValue(selectedCustomer);
    }
  }

  submit() {
    if (this.projectForm.invalid) return;

    if (this.data.project) {
      this.dialogRef.close({
        ...this.projectForm.value,
      });
    }
    if (!this.data.project) {
      this.dialogRef.close(this.projectForm.value);
    }
  }
}
