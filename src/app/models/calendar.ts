import { WeekCalendarDay } from './week-calendar-day';

export interface Calendar {
  weeksInCalendar: WeekCalendarDay[];
  numberOfWeeks: number;
}
