import { Activity } from './activity';
import { User } from './user';

export interface UserWithActivities {
  user: User;
  activities: Activity[];
}
