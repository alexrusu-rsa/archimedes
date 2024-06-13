import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivityService } from 'src/app/features/activity/services/activity-service/activity.service';
import { LocalStorageService } from './localstorage-service/localstorage.service';
import { DatePipe } from '@angular/common';
import { Activity } from '../models/activity';
import { UserService } from 'src/app/features/user/services/user-service/user.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookedTimeService {
  private service = inject(ActivityService);
  private localStorage = inject(LocalStorageService);
  private datePipe = inject(DatePipe);
  private userService = inject(UserService);
  private activities = toSignal(
    this.service.getActivitiesByDateEmployeeId(
      this.localStorage.userId,
      this.datePipe.transform(new Date(), 'dd/MM/yyyy')
    )
  );
  rawAlocatedTime = toSignal(
    this.userService
      .getUserTimePerDay(this.localStorage.userId)
      .pipe(map((timePerDay) => timePerDay.toString() + ':00'))
  );
  bookedTime = computed(() =>
    this.calculateTotalWorkingTime(this.activities())
  );
  alocatedTime = computed(() => this.rawAlocatedTime());

  private calculateTotalWorkingTime(activities: Activity[]): string {
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
