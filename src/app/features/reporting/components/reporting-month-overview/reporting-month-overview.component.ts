import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  effect,
  inject,
  input,
} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatCalendar,
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { ActivityStore } from 'src/app/features/activity/store/activity.store';

enum CellColor {
  red = 'red',
  orange = 'orange',
  green = 'green',
  default = '',
}
@Component({
  selector: 'app-reporting-month-overview',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCalendar,
    MatDatepickerModule,
    NgIf,
    TranslateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './reporting-month-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingMonthOverviewComponent {
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;

  protected readonly store = inject(ActivityStore);
  protected readonly activeMonth = input<Date>();

  protected readonly calendarEmptyHeader = CalendarEmptyHeaderComponent;

  constructor() {}
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate) => {
    const currentDate = new Date();

    const cursorDateISO = cellDate.toISOString();
    if (cursorDateISO > currentDate.toISOString()) {
      return CellColor.default;
    }

    const isWeekend =
      new Date(cursorDateISO).getDay() === 0 ||
      new Date(cursorDateISO).getDay() === 6;
    if (isWeekend) {
      return CellColor.default;
    }

    if (!this.store.monthYearReport()[cursorDateISO]) {
      return CellColor.red;
    }
    const [bookedHours, bookedMinutes] = this.store
      .monthYearReport()
      [cursorDateISO].timeBooked.split(':')
      .map(Number);
    const expectedHours =
      this.store.monthYearReport()[cursorDateISO].expectedHours;
    if (bookedHours >= expectedHours) {
      return CellColor.green;
    }

    if ((bookedHours > 0 || bookedMinutes > 0) && bookedHours < expectedHours) {
      return CellColor.orange;
    }

    if (bookedHours === 0 && bookedMinutes === 0) {
      return CellColor.red;
    }

    return CellColor.default;
  };
}
@Component({
  standalone: true,
  template: ``,
})
class CalendarEmptyHeaderComponent {}
