import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    const [hours, minutes] = value.split(':').map(Number);
    let result = '';

    if (hours > 0) {
      result += `${hours}h`;
    }

    if (minutes > 0) {
      result += ` ${minutes}m`;
    }

    if (minutes === 0 && hours === 0) result += '0h';

    return result.trim();
  }
}
