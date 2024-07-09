import { Component, DestroyRef, inject } from '@angular/core';
import { ReportingMonthOverviewComponent } from '../../components/reporting-month-overview/reporting-month-overview.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivityService } from 'src/app/features/activity/services/activity-service/activity.service';
import { AuthService } from 'src/app/core/auth/services/auth-service/auth.service';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from 'src/app/features/user/services/user-service/user.service';

@Component({
  selector: 'app-reporting-page',
  standalone: true,
  imports: [ReportingMonthOverviewComponent, AsyncPipe, NgIf],
  templateUrl: './reporting-page.component.html',
})
export class ReportingPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(AuthService);
  private readonly datePipe = inject(DatePipe);
  private readonly router = inject(Router);

  protected users = toSignal(inject(UserService).getUsers(), {
    initialValue: null,
  });

  protected bookedDays = toSignal(
    inject(ActivityService).getUsersWithActivities(new Date()),
    { initialValue: null }
  );
}
