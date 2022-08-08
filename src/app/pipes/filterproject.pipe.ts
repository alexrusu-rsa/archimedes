import { ClassPropertyMapping } from '@angular/compiler-cli/src/ngtsc/metadata';
import { Pipe, PipeTransform } from '@angular/core';
import { Activity } from '../models/activity';
import { Project } from '../models/project';

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
