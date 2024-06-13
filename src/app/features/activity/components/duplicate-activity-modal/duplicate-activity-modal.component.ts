import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
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
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { Activity } from 'src/app/shared/models/activity';
import { Icons } from 'src/app/shared/models/icons.enum';

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
    FormsModule,
    EntityItemComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './duplicate-activity-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuplicateActivityModalComponent {
  protected readonly icons = Icons;
  public activity: Activity = inject(MAT_DIALOG_DATA);
  protected start: WritableSignal<Date> = signal(new Date());
  protected end: WritableSignal<Date> = signal(new Date());
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
