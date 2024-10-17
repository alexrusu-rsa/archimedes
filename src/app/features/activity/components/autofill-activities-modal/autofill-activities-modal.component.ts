import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatError,
  MatFormFieldModule,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { Project } from 'src/app/shared/models/project';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {
  MatAutocomplete,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { Icons } from 'src/app/shared/models/icons.enum';

@Component({
  selector: 'app-autofill-activities-modal',
  standalone: true,
  imports: [
    MatHint,
    MatLabel,
    MatAutocomplete,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButton,
    FormsModule,
    TranslateModule,
    MatIconButton,
    MatError,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './autofill-activities-modal.component.html',
})
export class AutofillActivitiesModalComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  protected dialogRef = inject(MatDialogRef<AutofillActivitiesModalComponent>);
  protected data = inject(MAT_DIALOG_DATA);

  protected readonly icons = Icons;
  projects: Project[] = this.data.projects;
  fileUploadForm: FormGroup;
  fileInvalid = false;

  constructor(private fb: FormBuilder) {
    this.fileUploadForm = this.fb.group({
      pdfFile: new FormControl(null, [Validators.required]),
      project: new FormControl(null, [Validators.required]),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type !== 'application/pdf') {
        this.fileInvalid = true;
        this.fileUploadForm.get('pdfFile')?.reset();
        this.fileInput.nativeElement.value = '';
      } else {
        this.fileInvalid = false;
        this.fileUploadForm.get('pdfFile')?.setValue(file);
      }
    }
  }

  onSubmit(): void {
    if (this.fileUploadForm.valid) {
      const file = this.fileUploadForm.get('pdfFile')?.value;
      const selectedProjectId = this.fileUploadForm.get('project')?.value;

      this.dialogRef.close({ file, projectId: selectedProjectId });
    }
  }

  protected displayName(project) {
    return project?.name ? project.name : 'Other';
  }
}
