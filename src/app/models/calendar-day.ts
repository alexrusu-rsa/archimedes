import { Activity } from './activity';
import { EmployeeCommitmentCalendar } from './employee-commitment-calendar';
import { User } from './user';

export interface CalendarDay {
  color: string;
  timeBooked: number;
  expectedTimeCommitment: number;
  date: Date;
  employeesCommitment: EmployeeCommitmentCalendar[];
}
