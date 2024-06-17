import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  input,
} from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatCalendar,
  MatCalendarCellClassFunction,
  MatCalendarHeader,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { Activity } from '../../models/activity';
import { User } from '../../models/user';
import { BookedTimePipe } from '../../pipes/booked-time.pipe';
import { TimePipe } from '../../pipes/time.pipe';

@Component({
  selector: 'app-month-overview-widget',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCalendar,
    MatCalendarHeader,
    MatDatepickerModule,
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [provideNativeDateAdapter(), BookedTimePipe, TimePipe],
  styles: [
    `
    button.red
      background-color: red
      border-radius: 100%

    button.yellow
      background-color: yellow
      border-radius: 100%

    button.green
      background-color: green
      border-radius: 100%
    `,
  ],
  templateUrl: './month-overview-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthOverviewWidgetComponent {
  bookedTime = inject(BookedTimePipe);
  time = inject(TimePipe);
  activities = input<Activity[]>([]);
  user = input<User>();
  protected readonly calendarEmptyHeader = CalendarEmptyHeaderComponent;

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate) => {
    const activitiesOfDate = this.activities().filter(
      ({ date }) => new Date(date) === cellDate
    );

    const booked = this.bookedTime.transform(activitiesOfDate);
    const alocated = this.time.transform(this.user()?.timePerDay);

    if (booked === alocated) return 'green';
    if (booked < alocated) return 'yellow';

    return cellDate <= new Date() && activitiesOfDate.length === 0 ? 'red' : '';
  };
}

@Component({
  selector: 'app-empty-header-calendar',
  standalone: true,
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CalendarEmptyHeaderComponent {
  da;
}
