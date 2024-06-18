import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTodayDate',
  standalone: true,
})
export class TodayDatePipe implements PipeTransform {
  transform(value: Date): string {
    const date = new Date(value);
    const today = new Date();

    // Resetting the time part of the dates for accurate comparison
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else {
      // Use the Angular date pipe for standard formatting
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      return date.toLocaleDateString(undefined, options);
    }
  }
}
