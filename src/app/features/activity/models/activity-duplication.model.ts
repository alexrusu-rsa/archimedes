import { Activity } from '../../../models/activity';

export interface ActivityDuplication {
  activity: Activity;
  startDate: Date;
  endDate: Date;
}
