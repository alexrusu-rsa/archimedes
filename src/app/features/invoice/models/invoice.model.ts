import { Project } from 'src/app/shared/models/project';
import { Customer } from 'src/app/shared/models/customer';

export interface Invoice {
  customer: Customer;
  project: Project;
  month?: string;
  year?: string;
  series?: string;
}
