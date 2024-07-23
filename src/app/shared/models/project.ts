import { Customer } from './customer';

export interface Project {
  id?: string;
  projectName: string;
  customerId?: string;
  customer?: Customer;
  dueDate?: Date;
  contract?: string;
  contractSignDate?: Date;
  invoiceTerm?: number;
}
