import { Activity } from './activity';

export interface UserDateActivity {
  employeeId?: string;
  date?: string;
  activity?: Activity;
  projectId?: string;
}
