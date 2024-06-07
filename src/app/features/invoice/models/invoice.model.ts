import { Customer } from 'src/app/models/customer';
import { Project } from 'src/app/models/project';

export interface Invoice {
  customer: Customer;
  project: Project;
  month: string;
  year: string;
  series: string;
}
