import { EmployeeCommitmentCalendar } from './employee-commitment-calendar';

export interface CalendarDay {
  color: string;
  timeBooked: number;
  expectedTimeCommitment: number;
  date: Date;
  employeesCommitment: EmployeeCommitmentCalendar[];
  tooltipMessage: string;
}
