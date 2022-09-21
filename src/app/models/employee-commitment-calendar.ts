import { User } from './user';

export interface EmployeeCommitmentCalendar {
  employeeId: string;
  employeeName?: string;
  reportedHours: number;
  employeeExpectedCommitment: number;
}
