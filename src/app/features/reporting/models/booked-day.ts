import { UserDateTimeBooked } from './user-date-time-booked';

export interface BookedDay {
  timeBooked: string;
  expectedHours: number;
  usersTimeBooked: UserDateTimeBooked[];
  date: string;
}
