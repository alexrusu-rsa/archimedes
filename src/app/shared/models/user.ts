export interface User {
  id?: string;
  surname: string;
  name: string;
  role: string;
  seniority: string;
  email: string;
  password?: string;
  roles?: string;
  timePerDay: string;
}
