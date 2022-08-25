import { Pipe, PipeTransform } from '@angular/core';
import { Activity } from '../models/activity';

@Pipe({
  name: 'employee',
})
export class EmployeePipe implements PipeTransform {
  transform(value: Activity[], selectedEmployee: string): Activity[] {
    if (selectedEmployee !== 'ALLUSERS') {
      const filteredActivities = value.filter(
        (activity) => activity.employeeId === selectedEmployee
      );
      return filteredActivities;
    }
    return value;
  }
}
