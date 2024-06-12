import { Pipe, PipeTransform } from '@angular/core';

// TODO REmove this after new activity page release
@Pipe({
  name: 'shorten',
  standalone: true,
})
export class ShortenPipe implements PipeTransform {
  transform(value: string): string {
    if (value?.length > 20) return `${value?.slice(0, 19)}...`;
    return value;
  }
}
