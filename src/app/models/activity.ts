export interface Activity {
  id?: string;
  name?: string;
  date: string;
  start?: string;
  end?: string;
  projectId?: string;
  activityType?: string;
  description?: string;
  extras?: string;
  employeeId: string;
  workedTime?: string;
}
