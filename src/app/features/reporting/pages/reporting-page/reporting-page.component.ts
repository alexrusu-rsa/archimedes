import { Component, DestroyRef, Signal, inject } from '@angular/core';
import { ReportingMonthOverviewComponent } from '../../components/reporting-month-overview/reporting-month-overview.component';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, of, map } from 'rxjs';
import { ActivityService } from 'src/app/features/activity/services/activity-service/activity.service';
import { User } from 'src/app/shared/models/user';
import { LocalStorageService } from 'src/app/shared/services/localstorage-service/localstorage.service';
import { AuthService } from 'src/app/core/auth/services/auth-service/auth.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporting-page',
  standalone: true,
  imports: [ReportingMonthOverviewComponent],
  templateUrl: './reporting-page.component.html',
})
export class ReportingPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(AuthService);
  private readonly datePipe = inject(DatePipe);
  private readonly router = inject(Router);

  protected user: Signal<User> = toSignal(
    inject(LocalStorageService).userIdValue.pipe(
      switchMap((currentUserId) => {
        if (currentUserId) return this.service.getUserMe();
        else return of(null);
      }),
      map((user) => ({
        ...user,
      })),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: null }
  );

  protected bookedTimePerDay = toSignal(
    inject(ActivityService).getBookedTimePerDayOfMonthYear(new Date()),
    { initialValue: null }
  );

  navigateToDate(activityDate: Date) {
    this.router.navigate(['activity'], {
      queryParams: {
        date: this.datePipe.transform(activityDate, 'MM-dd-yyyy'),
      },
    });
  }
}
