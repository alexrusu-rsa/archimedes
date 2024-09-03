import { Activity } from 'src/app/shared/models/activity';

export interface DayReport {
  expectedHours: number;
  timeBooked: string;
  activities: Activity[];
}
export interface Days {
  [date: string]: DayReport;
}
