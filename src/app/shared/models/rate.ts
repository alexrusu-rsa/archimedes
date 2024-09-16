import { Project } from './project';
import { User } from './user';

export interface Rate {
  id?: string;
  projectId: string;
  employeeId: string;
  rate?: number;
  rateType?: string;
  employeeTimeCommitement?: number;
  project?: Project;
  user?: User;
}
