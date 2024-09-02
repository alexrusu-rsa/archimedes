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

  displayEmployeeSelect = false;

  ngOnInit(): void {
    this.activityForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        start: ['', Validators.required],
        end: ['', Validators.required],
        project: ['', Validators.required],
        activityType: ['', Validators.required],
        description: [''],
        extras: [''],
        employee: ['', Validators.required],
      },
      { validator: this.timeValidator }
    );
    console.log(this.data?.activity);

    if (this.data?.users) {
      this.displayEmployeeSelect = true;
    }

    if (this.data?.activity) {
      const start = new Date(this.data.activity.start);
      const end = new Date(this.data.activity.end);

      // Ensure the dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid Date format provided in activity');
      }

      const startHours = String(start.getHours()).padStart(2, '0');
      const startMinutes = String(start.getMinutes()).padStart(2, '0');

      const endHours = String(end.getHours()).padStart(2, '0');
      const endMinutes = String(end.getMinutes()).padStart(2, '0');

      this.activityForm.setValue({
        ...this.data.activity,
        start: `${startHours}:${startMinutes}`,
        end: `${endHours}:${endMinutes}`,
      });
    }
  }

  timeValidator(formGroup: FormGroup) {
    const startTime = formGroup.get('start').value;
    const endTime = formGroup.get('end').value;

    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      return start < end ? null : { timeInvalid: true };
    }
    return null;
  }

  protected splitToHoursAndMinutes(inputTime: string): Date {
    const splitInputTime = inputTime.split(':');
    const [hours, minutes] = [
      parseInt(splitInputTime[0]),
      parseInt(splitInputTime[1]),
    ];
    const resultDate = new Date();
    resultDate.setHours(hours, minutes, 0, 0);
    return resultDate;
  }

  submit() {
    const startTime = this.activityForm.get('start').value;
    const endTime = this.activityForm.get('end').value;

    if (this.activityForm.invalid) return;
    this.dialogRef.close({
      ...this.activityForm.value,
      start: this.splitToHoursAndMinutes(startTime),
      end: this.splitToHoursAndMinutes(endTime),
    });
  }

  protected displayName(project) {
    return project?.projectName ? project?.projectName : '';
  }
}
