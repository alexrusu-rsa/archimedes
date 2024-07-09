import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingMonthOverviewComponent {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly calendarEmptyHeader = CalendarEmptyHeaderComponent;
  protected readonly bookedDays = input<BookedDay[]>();

  service = inject(ActivityService);

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate) => {
    const formattedDate = this.formatDateToString(cellDate);

    const currentDate = new Date();
    if (cellDate > currentDate) {
      return CellColor.default;
    }
    //check is weekend
    if (cellDate.getDay() === 0 || cellDate.getDay() === 6) {
      return CellColor.default;
    }
    const currentDay = this.bookedDays().filter(
      (bookedDay) => bookedDay.date === formattedDate
    );

    if (
      parseInt(currentDay[0].timeBooked.split(':')[0]) >=
      currentDay[0].expectedHours
    ) {
      return CellColor.green;
    }
    if (
      (parseInt(currentDay[0].timeBooked.split(':')[0]) > 0 ||
        parseInt(currentDay[0].timeBooked.split(':')[1]) > 0) &&
      parseInt(currentDay[0].timeBooked.split(':')[0]) <
        currentDay[0].expectedHours
    ) {
      return CellColor.orange;
    }
    if (
      parseInt(currentDay[0].timeBooked.split(':')[0]) === 0 &&
      parseInt(currentDay[0].timeBooked.split(':')[1]) === 0
    ) {
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

  private convertTimeToMinutes(timeString: string): number {
    const [hoursStr, minutesStr] = timeString.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error('Invalid time format');
    }

    return hours * 60 + minutes;
  }
}

@Component({
  standalone: true,
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CalendarEmptyHeaderComponent {}
