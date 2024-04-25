import { Activity } from './activity';

export interface ActivitiesOfDate {
  date: string;
  activities: Activity[];
  reportedTime: number;
}
