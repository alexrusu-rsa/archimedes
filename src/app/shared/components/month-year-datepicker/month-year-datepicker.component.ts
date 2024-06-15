import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import moment from 'moment';

const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-month-year-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatInputModule,
    MatLabel,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
  ],
  styles: [
    `
      .example-month-picker .mat-calendar-period-button 
        pointer-events: none
      

      .example-month-picker .mat-calendar-arrow 
        display: none
      
    `,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  templateUrl: './month-year-datepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthYearDatepickerComponent {
  label = input('');
  datePickerValueChanged = output<Date>();
  protected date = signal(moment());
}
