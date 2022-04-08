import { Project } from 'src/app/models/project';
import { Customer } from './customer';
export interface ProjectCustomersPack {
  project?: Project;
  customers: Customer[];
}
