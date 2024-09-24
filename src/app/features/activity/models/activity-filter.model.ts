import { Project } from 'src/app/shared/models/project';
import { User } from 'src/app/shared/models/user';

export interface ActivityFilter {
  date?: Date;
  project?: Project;
  activeMonth?: Date;
  user?: User;
}
