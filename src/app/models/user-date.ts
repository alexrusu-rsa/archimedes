import { ActivitiesOfDate } from './activities-of-date';

export interface UserDate {
  userId: string;
  date: Date;
  activitiesOfDate: ActivitiesOfDate;
}
