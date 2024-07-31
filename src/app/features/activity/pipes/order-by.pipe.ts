import { Pipe, type PipeTransform } from '@angular/core';
import { Activity } from 'src/app/shared/models/activity';

@Pipe({
  name: 'orderBy',
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

      const aStartTime = a.start.getTime();
      const bStartTime = a.start.getTime();

      if (aStartTime !== bStartTime) {
        return aStartTime - bStartTime;
      }

      const aEndTime = a.end.getTime();
      const bEndTime = a.end.getTime();

      if (aEndTime !== bEndTime) {
        return aEndTime - bEndTime;
      }

      return aStartTime;
    });
  }
}
