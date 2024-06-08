import { Activity } from '../../../shared/models/activity';

export interface UserDateActivity {
  employeeId?: string;
  date?: string;
  activity?: Activity;
  projectId?: string;
}
