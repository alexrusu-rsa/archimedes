import { EmployeeCommitmentCalendar } from 'src/app/shared/models/employee-commitment-calendar';

export interface WeekCalendarDay {
  weekDays?: CalendarDay[];
}

export interface CalendarDay {
  color: string;
  timeBooked: number;
  expectedTimeCommitment: number;
  date: Date;
  employeesCommitment: EmployeeCommitmentCalendar[];
  tooltipMessage: string;
  opacity?: number;
}
