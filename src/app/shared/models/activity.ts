import { Project } from './project';
import { User } from './user';

export interface Activity {
  id?: string;
  name?: string;
  date: Date;
  start?: Date;
  end?: Date;
  projectId?: string;
  activityType?: string;
  description?: string;
  extras?: string;
  employeeId: string;
  workedTime?: string;
  project?: Project;
  projectName?: string;//TODO remove this
  employee?: string; //TODO remove this
  user?: User;
}
