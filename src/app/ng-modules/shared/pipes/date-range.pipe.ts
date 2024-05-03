import { Pipe, PipeTransform } from '@angular/core';
import { Activity } from '../../../models/activity';

@Pipe({
  name: 'dateRange',
})
export class DateRangePipe implements PipeTransform {
  transform(value: Activity[], start: Date, end: Date): Activity[] {
    if (value !== undefined) {
      const filteredActivities = value.filter(
        (activity) =>
          this.stringToDate(activity.date) >= start &&
          this.stringToDate(activity.date) <= end
      );
      if (filteredActivities) return filteredActivities;
    }
    return [];
  }

  private stringToDate(dateString: string) {
    const splitDateString = dateString.split('/');
    const dateStringISO =
      splitDateString[2] + '-' + splitDateString[1] + '-' + splitDateString[0];
    return new Date(dateStringISO);
  }
}
