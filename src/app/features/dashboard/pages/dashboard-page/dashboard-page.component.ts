import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Signal,
  inject,
} from '@angular/core';
import { SalutationComponent } from '../../components/salutation/salutation.component';
import { LocalStorageService } from 'src/app/shared/services/localstorage-service/localstorage.service';
import { AuthService } from 'src/app/core/auth/services/auth-service/auth.service';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, of, map } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { BookedTimeWidgetComponent } from 'src/app/shared/components/booked-time-widget/booked-time-widget.component';
import { ActivityStore } from 'src/app/features/activity/store/activity.store';
import { BookedTimePipe } from 'src/app/shared/pipes/booked-time.pipe';
import { MonthOverviewWidgetComponent } from 'src/app/shared/components/month-overview-widget/month-overview-widget.component';
import { ActivityService } from 'src/app/features/activity/services/activity-service/activity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    SalutationComponent,
    BookedTimeWidgetComponent,
    MonthOverviewWidgetComponent,
    BookedTimePipe,
    DatePipe,
  ],
  styles: [
    `
      :host
        display: flex
        flex-direction: column
        gap: 1em
    `,
  ],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(AuthService);
  private readonly router = inject(Router);
  private readonly datePipe = inject(DatePipe);
  public readonly store = inject(ActivityStore);

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
        date: this.datePipe.transform(
          activityDate.setDate(activityDate.getDate()),
          'MM-dd-yyyy'
        ),
      },
    });
  }
}
