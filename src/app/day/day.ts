import { Activity } from '../activity/activity';

export interface Day {
  id: number;
  date: string;
  activities?: Activity[];
}
