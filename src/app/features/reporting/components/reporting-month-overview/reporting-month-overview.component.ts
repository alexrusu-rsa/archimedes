import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  effect,
  inject,
  input,
  output,
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
import { ActivityService } from 'src/app/features/activity/services/activity-service/activity.service';
import { BookedDay } from '../../models/booked-day';
import { toObservable } from '@angular/core/rxjs-interop';

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
    TranslateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './reporting-month-overview.component.html',
})
export class ReportingMonthOverviewComponent {
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;

  protected readonly bookedDays = input<BookedDay[]>();
  protected readonly activeMonth = input<Date>();

  protected readonly calendarEmptyHeader = CalendarEmptyHeaderComponent;

  service = inject(ActivityService);
  constructor() {
    effect(() => {
      if (this.activeMonth() && this.calendar) {
        this.calendar.activeDate = new Date(this.activeMonth());
        this.calendar?.updateTodaysDate();
      }
    });
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate) => {
    const formattedDate = this.formatDateToString(cellDate);

    const currentDate = new Date();

    if (cellDate > currentDate) {
      return CellColor.default;
    }

    const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
    if (isWeekend) {
      return CellColor.default;
    }

    const currentDay = this.bookedDays().find(
      (bookedDay) => bookedDay.date === formattedDate
    );

    if (!currentDay) {
      return CellColor.default;
    }

    const bookedHours = parseInt(currentDay.timeBooked.split(':')[0]);
    const bookedMinutes = parseInt(currentDay.timeBooked.split(':')[1]);
    const expectedHours = currentDay.expectedHours;

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

  private formatDateToString(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
@Component({
  standalone: true,
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CalendarEmptyHeaderComponent {}
