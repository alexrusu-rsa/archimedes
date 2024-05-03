import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../../models/user';

@Pipe({
  name: 'employeeIdToName',
})
export class EmployeeIdToNamePipe implements PipeTransform {
  transform(employeeId: string, users: User[]): string {
    const matchingUser = users.filter((user) => user.id === employeeId);
    if (matchingUser) return matchingUser[0].name;
    return employeeId;
  }
}
