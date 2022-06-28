import { Pipe, PipeTransform } from '@angular/core';
import { Activity } from '../models/activity';

@Pipe({
  name: 'dateRange',
})
export class DateRangePipe implements PipeTransform {
  transform(value: Activity[], start: Date, end: Date): Activity[] {
    // const endDate = end;
    // endDate.setDate(end.getDate() + 1);
    const filteredActivities = value.filter(
      (activity) =>
        this.stringToDate(activity.date) >= start &&
        this.stringToDate(activity.date) <= end
    );
    return filteredActivities;
  }

  private stringToDate(dateString: string) {
    const splitDateString = dateString.split('/');
    const dateStringISO =
      splitDateString[2] + '-' + splitDateString[1] + '-' + splitDateString[0];
    return new Date(dateStringISO);
  }
}
