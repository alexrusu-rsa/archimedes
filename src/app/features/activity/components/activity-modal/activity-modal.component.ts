import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import {
  MatLabel,
  MatHint,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Icons } from 'src/app/shared/models/icons.enum';
import { Project } from 'src/app/shared/models/project';

@Component({
  selector: 'app-activity-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCard,
    MatCardTitle,
    MatLabel,
    MatIcon,
    MatHint,
    MatFormFieldModule,
    MatButton,
    MatIconButton,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    KeyValuePipe,
  ],
  templateUrl: './activity-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityModalComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ActivityModalComponent>);
  private formBuilder = inject(FormBuilder);
  protected data = inject(MAT_DIALOG_DATA);
  protected activityProjects: Project[];
  protected activityTypes: string[];
  protected readonly icons = Icons;
  protected activityForm: FormGroup;
  protected validators = Validators;

  ngOnInit(): void {
    this.activityForm = this.formBuilder.group({
      name: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      project: [null, Validators.required],
      activityType: ['', Validators.required],
      description: [''],
      extras: [''],
    });

    if (this.data?.activity) {
      this.activityForm.setValue(this.data?.activity);
    }
  }

  submit() {
    if (this.activityForm.invalid) return;
    this.dialogRef.close(this.activityForm.value);
  }

  protected displayName(project) {
    return project?.projectName ? project?.projectName : '';
  }
}
