import { Activity } from 'src/app/shared/models/activity';
import { User } from 'src/app/shared/models/user';

export interface UserWithActivities {
  user: User;
  activities: Activity[];
}
