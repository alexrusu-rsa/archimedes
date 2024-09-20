import { Pipe, PipeTransform } from '@angular/core';
import { convertTimeToHours } from 'src/app/shared/utils/date-time.utils';
@Pipe({
  name: 'convertTimeToHours',
  standalone: true,
})
export class ConvertTimeToHoursPipe implements PipeTransform {
  transform(value: string): number {
    return convertTimeToHours(value);
  }
}
