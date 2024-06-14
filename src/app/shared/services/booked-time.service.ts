import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocalStorageService } from './localstorage-service/localstorage.service';
import { Activity } from '../models/activity';
import { UserService } from 'src/app/features/user/services/user-service/user.service';
import { map } from 'rxjs';
import { ActivityStore } from '../store/activity.store';

@Injectable({
  providedIn: 'root',
})
export class BookedTimeService {
  private localStorage = inject(LocalStorageService);
  private userService = inject(UserService);
  private store = inject(ActivityStore);

  rawAlocatedTime = toSignal(
    this.userService
      .getUserTimePerDay(this.localStorage.userId)
      .pipe(map((timePerDay) => timePerDay.toString() + ':00'))
  );
  bookedTime = computed(() =>
    this.calculateTotalWorkingTime(this.store.activities())
  );
  alocatedTime = computed(() => this.rawAlocatedTime());
  displayDate = computed(() => this.store.filter().date);

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
