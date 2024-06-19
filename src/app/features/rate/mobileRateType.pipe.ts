import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'mobileRateType',
  standalone: true,
})
export class MobileRateTypePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'hourly':
        return '/h';
      case 'daily':
        return '/day';
      case 'monthly':
        return '/month';
      case 'project':
        return '/project';
    }

    return '';
  }
}
