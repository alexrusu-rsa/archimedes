import {
  ChangeDetectionStrategy,
  Component,
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
  protected readonly calendarEmptyHeader = CalendarEmptyHeaderComponent;
  protected readonly bookedTimeOfMonth = input<unknown>();
  protected readonly alocatedTime = input<string>();
  protected readonly dateSelected = output<Date>();

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate) => {
    const currentDate = new Date();
    console.log(currentDate);
    const formattedDate = this.formatDateToString(cellDate);
    console.log(formattedDate);
    const bookedTime = this.bookedTimeOfMonth()[formattedDate];
    const allocatedTimeMinutes = this.convertTimeToMinutes(this.alocatedTime());

    if (cellDate > currentDate) {
      return CellColor.default;
    }

    if (cellDate.getDay() === 0 || cellDate.getDay() === 6) {
      return bookedTime > 0 ? CellColor.orange : CellColor.default;
    }

    if (bookedTime === 0) {
      return CellColor.red;
    }

    if (allocatedTimeMinutes !== bookedTime) {
      return CellColor.orange;
    }

    return CellColor.green;
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
