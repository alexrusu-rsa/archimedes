export interface Activity {
  id?: string;
  name?: string;
  date: string;
  start?: string;
  end?: string;
  projectId?: string;
  description?: string;
  extras?: string;
  employeeId: string;
}
