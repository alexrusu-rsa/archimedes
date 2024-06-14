import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appBookedPercentage',
  standalone: true,
})
export class BookedPercentagePipe implements PipeTransform {
  transform(bookedTime: string, allocatedTime: string): number {
    if (!bookedTime || !allocatedTime) {
      return 0;
    }

    const [bookedHours, bookedMinutes] = bookedTime.split(':').map(Number);
    const [allocatedHours, allocatedMinutes] = allocatedTime
      .split(':')
      .map(Number);

    const totalBookedMinutes = bookedHours * 60 + bookedMinutes;
    const totalAllocatedMinutes = allocatedHours * 60 + allocatedMinutes;

    if (totalAllocatedMinutes === 0) {
      return 0;
    }

    const percentage = (totalBookedMinutes / totalAllocatedMinutes) * 100;

    return Math.min(100, Math.max(0, Math.round(percentage)));
  }
}
