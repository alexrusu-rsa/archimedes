import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from '../../../models/customer';
import { Project } from '../../../models/project';

@Pipe({
  name: 'customerfromprojectid',
})
export class CustomerfromprojectidPipe implements PipeTransform {
  transform(id: string, projects: Project[], customers: Customer[]): string {
    const matchingProject = projects.filter((project) => project.id === id);
    if (matchingProject) {
      const matchingCustomer = customers.filter(
        (customer) => customer.id === matchingProject[0].customerId!
      );
      if (matchingCustomer[0].shortName) return matchingCustomer[0].shortName;
      return 'NO CUSTOMER';
    }
    return 'NO CUSTOMER';
  }
}
