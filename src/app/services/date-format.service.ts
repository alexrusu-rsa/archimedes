import { Injectable } from '@angular/core';
import { HoursAndMinutes } from '../models/hours_minutes';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  constructor() {}
  getNewDateWithTime(time: string): Date {
    const newDate = new Date();
    newDate.setTime(this.toMilliseconds(time));
    return newDate;
  }

  toMilliseconds(time: string): number {
    if(time){
      const hoursAndMinutes = time.split(':');
      if( hoursAndMinutes ){
        const hours = Number(hoursAndMinutes[0]);
        const minutes = Number(hoursAndMinutes[1]);
        return (
          this.hoursToMilliseconds(hours) + this.minutesToMilliseconds(minutes)
        );
        }
    }
    return 0;
  }

  hoursToMilliseconds(hours: number): number {
    return 3600 * 1000 * hours;
  }

  minutesToMilliseconds(minutes: number): number {
    return 60000 * minutes;
  }

  millisecondsToSeconds(milliseconds: number): number {
    return milliseconds / 1000;
  }

  secondsToMinutes(seconds: number): number {
    return seconds / 60;
  }

  minutesToHours(minutes: number): number {
    return minutes / 60;
  }

  millisecondsToHoursAndMinutes(milliseconds: number): HoursAndMinutes {
    const seconds = this.millisecondsToSeconds(milliseconds);
    const minutes = this.secondsToMinutes(seconds);
    const hours = Math.floor(this.minutesToHours(minutes));
    const finalMinutes = minutes - hours * 60;
    return new HoursAndMinutes(hours, finalMinutes);
  }

}
