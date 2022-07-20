import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';

@Pipe({
  name: 'employeeid',
})
export class EmployeeidPipe implements PipeTransform {
  transform(id: string, users: User[]): string {
    const matchingUser = users.filter((user) => user.id === id);
    if (matchingUser)
      return `${matchingUser[0].name} ${matchingUser[0].surname}`;
    return id;
  }
}
