import { UserDateTimeBooked } from './user-date-time-booked';

export interface BookedDay {
  timeBooked: string;
  expectedHours: number;
  bookedUsers: UserDateTimeBooked[];
  date: string;
}
