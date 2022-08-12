import { Activity } from './activity';

export interface ProjectIdActivities {
  projectId: string;
  activitiesWithProjectId: Activity[];
  visible?: boolean;
}
