import { User } from './user';

export interface EmployeeCommitmentCalendar {
  employee: User;
  reportedHours: number;
  employeeExpectedCommitment: number;
}
