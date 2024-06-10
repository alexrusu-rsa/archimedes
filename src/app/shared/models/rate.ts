export interface Rate {
  id?: string;
  projectId: string;
  employeeId: string;
  rate?: number;
  rateType?: string;
  employeeTimeCommitement?: number;
}
