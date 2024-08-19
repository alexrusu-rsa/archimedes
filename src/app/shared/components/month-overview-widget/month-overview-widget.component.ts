import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
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
import { WidgetDay } from 'src/app/features/invoice/models/widget-day';

enum CellColor {
  red = 'red',
  orange = 'orange',
  green = 'green',
  default = '',
}

@Component({
  selector: 'app-month-overview-widget',
  standalone: true,
  imports: [
    TranslateModule,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatCalendar,
    MatDatepickerModule,
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [provideNativeDateAdapter()],
  templateUrl: './month-overview-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthOverviewWidgetComponent {
  protected readonly calendarEmptyHeader = CalendarEmptyHeaderComponent;
  protected readonly bookedTimeOfMonth = input<WidgetDay[]>();
  protected readonly alocatedTime = input<string>();
  protected readonly dateSelected = output<Date>();
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate) => {
    const currentDate = new Date();

    const cursorDate = this.bookedTimeOfMonth().find((widgetDay) => {
      const widgetDayDate = new Date(widgetDay.date);
      return widgetDayDate.toDateString() === cellDate.toDateString();
    });

    let cursorDateBookTimeInMinutes = 0;
    if (cursorDate) {
      const timeBooked = cursorDate.timeBooked || '00:00';
      cursorDateBookTimeInMinutes = this.convertTimeToMinutes(timeBooked);
    }

    const allocatedTimeMinutes = this.convertTimeToMinutes(this.alocatedTime());

    if (cellDate > currentDate) {
      return CellColor.default;
    }

    if (cellDate.getDay() === 0 || cellDate.getDay() === 6) {
      return cursorDateBookTimeInMinutes > 0
        ? CellColor.orange
        : CellColor.default;
    }

    if (cursorDateBookTimeInMinutes === 0) {
      return CellColor.red;
    }

    if (allocatedTimeMinutes !== cursorDateBookTimeInMinutes) {
      return CellColor.orange;
    }

    return CellColor.green;
  };

  private convertTimeToMinutes(timeString: string): number {
    if (!timeString) {
      return 0;
    }

    const [hoursStr, minutesStr] = timeString.split(':');

    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error(`Invalid time format: ${timeString}`);
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
