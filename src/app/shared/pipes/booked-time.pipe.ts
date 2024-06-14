import { Pipe, type PipeTransform } from '@angular/core';
import { Activity } from '../models/activity';

@Pipe({
  name: 'appBookedTime',
  standalone: true,
})
export class BookedTimePipe implements PipeTransform {
  transform(activities: Activity[]): string {
    if (!activities) return '00:00';
    let totalMinutes = 0;

    activities.forEach((activity) => {
      const [hours, minutes] = activity.workedTime.split(':').map(Number);
      totalMinutes += hours * 60 + minutes;
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    let result = '';
    if (totalHours > 9) {
      result += `${totalHours}`;
    } else result += `0${totalHours}`;

    if (remainingMinutes > 9) {
      result += ':';
      result += `${remainingMinutes}`;
    } else result += `:0${remainingMinutes}`;

    if (result === '') {
      result = '00';
    }

    return result.trim();
  }
}
