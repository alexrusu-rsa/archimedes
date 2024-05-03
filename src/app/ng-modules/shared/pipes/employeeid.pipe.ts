import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../../models/user';

@Pipe({
  name: 'employeeid',
})
export class EmployeeidPipe implements PipeTransform {
  transform(id: string, users: User[]): string {
    if (id && users) {
      const matchingUser = users.find((user) => user.id === id);
      if (matchingUser)
        if (matchingUser.name && matchingUser.surname)
          return `${matchingUser.name} ${matchingUser.surname}`;
      return 'could not find user name;';
    }
    return id;
  }
}
