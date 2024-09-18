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
import { ActivityService } from 'src/app/features/activity/services/activity-service/activity.service';
import { BookedDay } from '../../models/booked-day';
import { NgIf } from '@angular/common';
import { Days } from '../../models/days';
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
})
export class ReportingMonthOverviewComponent {
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;

  protected readonly bookedDays = input<BookedDay[]>();
  protected readonly store = inject(ActivityStore);
  protected readonly monthYearReport = input<Days>();
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

    // Check if cursorDate exists in monthYearReport()
    const currentDayReport = this.store.monthYearReport()[cursorDateISO];
    if (!currentDayReport) {
      return CellColor.red;
    }

    const [bookedHours, bookedMinutes] = currentDayReport.timeBooked
      .split(':')
      .map(Number);
    const expectedHours = currentDayReport.expectedHours;

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

  // dateClass: MatCalendarCellClassFunction<Date> = (cellDate) => {
  //   const currentDate = new Date();
  //   console.log(Object.keys(this.monthYearReport()));
  //   if (Object.keys(this.monthYearReport()).find(cellDate.toISOString())) {
  //   }

  //   const toRomaniaDate = (date: Date): Date => {
  //     const options = {
  //       timeZone: 'Europe/Bucharest',
  //       year: 'numeric',
  //       month: 'numeric',
  //       day: 'numeric',
  //     } as const;
  //     const formatter = new Intl.DateTimeFormat('en-US', options);
  //     const parts = formatter.formatToParts(date).reduce((acc, part) => {
  //       if (part.type !== 'literal') acc[part.type] = parseInt(part.value, 10);
  //       return acc;
  //     }, {} as Record<string, number>);

  //     return new Date(parts['year'], parts['month'] - 1, parts['day']);
  //   };

  //   const cursorDate = toRomaniaDate(cellDate);
  //   const currentRomaniaDate = toRomaniaDate(currentDate);

  //   if (cursorDate > currentRomaniaDate) {
  //     return CellColor.default;
  //   }

  //   const isWeekend = cursorDate.getDay() === 0 || cursorDate.getDay() === 6;
  //   if (isWeekend) {
  //     return CellColor.default;
  //   }

  //   const currentDay = this.bookedDays().find((bookedDay) => {
  //     const bookedDayDate = toRomaniaDate(new Date(bookedDay.date));
  //     return bookedDayDate.toDateString() === cursorDate.toDateString();
  //   });

  //   if (!currentDay) {
  //     return CellColor.default;
  //   }

  //   const [bookedHours, bookedMinutes] = currentDay.timeBooked
  //     .split(':')
  //     .map(Number);
  //   const expectedHours = currentDay.expectedHours;

  //   if (bookedHours >= expectedHours) {
  //     return CellColor.green;
  //   }

  //   if ((bookedHours > 0 || bookedMinutes > 0) && bookedHours < expectedHours) {
  //     return CellColor.orange;
  //   }

  //   if (bookedHours === 0 && bookedMinutes === 0) {
  //     return CellColor.red;
  //   }

  //   return CellColor.default;
  // };
}
@Component({
  standalone: true,
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CalendarEmptyHeaderComponent {}
