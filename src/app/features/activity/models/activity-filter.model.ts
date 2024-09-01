import { Project } from 'src/app/shared/models/project';

export interface ActivityFilter {
  date?: Date;
  project?: Project;
  activeMonth?: Date;
}
