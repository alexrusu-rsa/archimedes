import { Pipe, type PipeTransform } from '@angular/core';
import { Activity } from 'src/app/shared/models/activity';

@Pipe({
  name: 'appOrderBy',
  standalone: true,
})
export class OrderByPipe implements PipeTransform {
  transform(activities: Activity[], field?: string): Activity[] {
    return activities?.sort((a, b) => {
      return +(a[field] < b[field]);
    });
  }
}
