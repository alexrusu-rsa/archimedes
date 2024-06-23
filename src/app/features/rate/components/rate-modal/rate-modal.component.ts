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
import { MatOption, MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepickerModule,
  MatDatepicker,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatLabel, MatHint, MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectModalComponent } from 'src/app/features/project/components/project-modal/project-modal/project-modal.component';
import { Icons } from 'src/app/shared/models/icons.enum';
import { isJSDocNonNullableType } from 'typescript';

@Component({
  selector: 'app-rate-modal',
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
  templateUrl: './rate-modal.component.html',
})
export class RateModalComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ProjectModalComponent>);
  private formBuilder = inject(FormBuilder);
  protected data = inject(MAT_DIALOG_DATA);
  protected rateForm: FormGroup;
  protected validators = Validators;
  protected readonly icons = Icons;

  ngOnInit(): void {
    this.rateForm = this.formBuilder.group({
      project: ['', Validators.required],
      user: ['', Validators.required],
      rate: ['', Validators.required],
      rateType: new FormControl('', Validators.required),
      employeeTimeCommitement: new FormControl('', Validators.required),
    });
    if (this.data?.rate) {
      this.rateForm.patchValue(this.data?.rate);
      const selectedProject = this.data?.projects.find(
        (project) => project.id === this.data?.rate?.projectId
      );
      const selectedUser = this.data?.users?.find(
        (user) => user.id === this.data?.rate?.employeeId
      );
      this.rateForm
        .get('employeeTimeCommitement')
        .setValue(this.data?.rate?.employeeTimeCommitement);
      this.rateForm.get('project').setValue(selectedProject);
      this.rateForm.get('user').setValue(selectedUser);
    }
  }

  submit() {
    if (this.rateForm.invalid) return;

    if (this.data.project) {
      this.dialogRef.close({
        ...this.rateForm.value,
      });
    }
    if (!this.data.project) {
      this.dialogRef.close(this.rateForm.value);
    }
  }
}
