import { Activity } from '../../../shared/models/activity';

export interface ActivityDuplication {
  activity: Activity;
  endDate: Date;
  startDate: Date;
}
