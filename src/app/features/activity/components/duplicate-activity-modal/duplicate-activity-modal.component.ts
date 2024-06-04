import { Activity } from './../../../../models/activity';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  WritableSignal,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import {
  MatDateRangeInput,
  MatDateRangePicker,
  MatDatepickerToggle,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import {
  MatDialogActions,
  MatDialogTitle,
  MatDialogClose,
  MAT_DIALOG_DATA,
  MatDialogContent,
} from '@angular/material/dialog';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Icons } from 'src/app/models/icons.enum';

@Component({
  selector: 'app-duplicate-activity-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatButton,
    MatIconButton,
    MatDialogActions,
    MatDialogTitle,
    MatDialogClose,
    MatDialogContent,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatFormField,
    MatLabel,
    MatStartDate,
    MatEndDate,
    MatDateRangeInput,
    MatDatepickerToggle,
    MatDateRangePicker,
    MatSuffix,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './duplicate-activity-modal.component.html',
  styleUrl: './duplicate-activity-modal.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuplicateActivityModalComponent {
  protected icons = Icons;
  protected start: WritableSignal<Date> = signal(new Date());
  protected end: WritableSignal<Date> = signal(new Date());
  constructor(@Inject(MAT_DIALOG_DATA) public activity: Activity) {}
}

export const duplicateActivityModalPreset = {
  maxHeight: '50%',
  minHeight: '350px',
  panelClass: [
    'translate-middle-y',
    'top-50',
    'start-50',
    'justify-content-center',
    'col-12',
    'col-xs-12',
    'col-sm-12',
    'col-md-12',
    'col-lg-4',
    'col-xl-4',
    'col-xxl-3',
  ],
};
