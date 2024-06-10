import { Activity } from '../../../shared/models/activity';

export interface ActivityDuplication {
  activity: Activity;
  startDate: Date;
  endDate: Date;
}
