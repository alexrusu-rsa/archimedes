import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'workedTime',
  standalone: true,
})
export class WorkedTimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const [hours, minutes] = value.split(':').map(Number);

    const hoursText = hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : '';
    const minutesText =
      minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : '';

    if (hoursText && minutesText) {
      return `(${hoursText} and ${minutesText})`;
    } else {
      return `(${hoursText || minutesText})`;
    }
  }
}
