import { Project } from './project';

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
  projectName?: string;
}
