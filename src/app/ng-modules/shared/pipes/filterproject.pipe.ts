import { Pipe, PipeTransform } from '@angular/core';
import { Activity } from '../../../models/activity';

@Pipe({
  name: 'filterproject',
})
export class FilterprojectPipe implements PipeTransform {
  transform(activities: Activity[], projectId: string): Activity[] {
    if (projectId !== undefined && projectId !== null) {
      const filteredActivities = activities.filter(
        (activity) => activity.projectId === projectId
      );
      return filteredActivities;
    }
    return activities;
  }
}
