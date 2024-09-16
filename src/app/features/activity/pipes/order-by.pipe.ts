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

      const startComparison = this.compareDates(a.start, b.start);
      if (startComparison !== 0) {
        return startComparison;
      }

      const endComparison = this.compareDates(a.end, b.end);
      if (endComparison !== 0) {
        return endComparison;
      }

      return 0;
    });
  }

  private compareDates(date1: Date, date2: Date): number {
    const time1 = new Date(date1).getTime();
    const time2 = new Date(date2).getTime();

    if (isNaN(time1) || isNaN(time2)) {
      if (!isNaN(time1)) return -1;
      if (!isNaN(time2)) return 1;
      return 0;
    }

    return time1 - time2;
  }
}
