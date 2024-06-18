import { Customer } from './customer';

export interface Project {
  id?: string;
  projectName: string;
  customerId: string;
  customer?: Customer;
  dueDate?: string;
  contract?: string;
  contractSignDate?: string;
  invoiceTerm?: number;
}
