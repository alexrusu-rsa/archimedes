import { Pipe, type PipeTransform } from '@angular/core';
import { Activity } from 'src/app/shared/models/activity';

@Pipe({
  name: 'appOrderBy',
  standalone: true,
})
export class OrderByPipe implements PipeTransform {
  transform(activities: Activity[]): Activity[] {
    if (!activities) return [];

    return activities.sort((a, b) => {
      const [aStartHours, aStartMinutes] = a.start.split(':').map(Number);
      const [bStartHours, bStartMinutes] = b.start.split(':').map(Number);

      const [aEndHours, aEndMinutes] = a.end.split(':').map(Number);
      const [bEndHours, bEndMinutes] = b.end.split(':').map(Number);

      if (aStartHours !== bStartHours) {
        return aStartHours - bStartHours;
      } else if (aStartMinutes !== bStartMinutes) {
        return aStartMinutes - bStartMinutes;
      } else if (aEndHours !== bEndHours) {
        return aEndHours - bEndHours;
      } else {
        return aEndMinutes - bEndMinutes;
      }
    });
  }
}
