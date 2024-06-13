import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTime',
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
    } else {
      result += '0h';
    }

    if (minutes > 0) {
      result += ` ${minutes}m`;
    }

    return result.trim();
  }
}
