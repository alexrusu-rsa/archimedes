import { Activity } from '../activity/activity';

export interface Day {
  id: string;
  date: string;
  activities?: Activity[];
}
