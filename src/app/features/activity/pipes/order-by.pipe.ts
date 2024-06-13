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
      // Handle project sorting
      if (a.project && b.project) {
        if (a.project.projectName !== b.project.projectName) {
          return a.project.projectName.localeCompare(b.project.projectName);
        }
      } else if (a.project && !b.project) {
        return -1; // a goes before b (b is null)
      } else if (!a.project && b.project) {
        return 1; // b goes before a (a is null)
      }

      // If both have the same project or both are null, sort by start time
      const [aStartHours, aStartMinutes] = a.start.split(':').map(Number);
      const [bStartHours, bStartMinutes] = b.start.split(':').map(Number);

      if (aStartHours !== bStartHours) {
        return aStartHours - bStartHours;
      } else if (aStartMinutes !== bStartMinutes) {
        return aStartMinutes - bStartMinutes;
      }

      // If start times are the same, sort by end time
      const [aEndHours, aEndMinutes] = a.end.split(':').map(Number);
      const [bEndHours, bEndMinutes] = b.end.split(':').map(Number);

      if (aEndHours !== bEndHours) {
        return aEndHours - bEndHours;
      } else {
        return aEndMinutes - bEndMinutes;
      }
    });
  }
}
