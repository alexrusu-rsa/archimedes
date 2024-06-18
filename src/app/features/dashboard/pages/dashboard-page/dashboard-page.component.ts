import { CommonModule } from '@angular/common';
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
import { switchMap, of } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { BookedTimeWidgetComponent } from 'src/app/shared/components/booked-time-widget/booked-time-widget.component';
import { ActivityStore } from 'src/app/features/activity/store/activity.store';
import { BookedTimePipe } from 'src/app/shared/pipes/booked-time.pipe';
import { MonthOverviewWidgetComponent } from 'src/app/shared/components/month-overview-widget/month-overview-widget.component';
import { Activity } from 'src/app/shared/models/activity';
import { ActivityService } from 'src/app/features/activity/services/activity-service/activity.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    SalutationComponent,
    BookedTimeWidgetComponent,
    MonthOverviewWidgetComponent,
    BookedTimePipe,
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
  public readonly store = inject(ActivityStore);

  protected user: Signal<User> = toSignal(
    inject(LocalStorageService).userIdValue.pipe(
      switchMap((currentUserId) => {
        if (currentUserId) return this.service.getUser(currentUserId);
        else return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: null }
  );

  protected activities: Signal<Activity[]> = toSignal(
    inject(ActivityService).getActivitiesOfMonthYearForUser(
      new Date().getMonth() < 10
        ? '0' + new Date().getMonth().toString()
        : new Date().getMonth().toString(),
      new Date().getFullYear().toString()
    ),
    { initialValue: [] }
  );
}
