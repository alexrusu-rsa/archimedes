import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ReportingMonthOverviewComponent } from '../../components/reporting-month-overview/reporting-month-overview.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivityService } from 'src/app/features/activity/services/activity-service/activity.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { EntityPageHeaderComponent } from 'src/app/shared/components/entity-page-header/entity-page-header.component';
import { DatePickerType } from 'src/app/shared/models/date-picker-type.enum';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BookedDay } from '../../models/booked-day';
import { NotificationService } from 'src/app/core/services/notification-service/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ReportingActivitiesViewComponent } from '../../components/reporting-activities-view/reporting-activities-view.component';

@Component({
  selector: 'app-reporting-page',
  standalone: true,
  imports: [
    ReportingMonthOverviewComponent,
    AsyncPipe,
    NgIf,
    EntityPageHeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReportingActivitiesViewComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './reporting-page.component.html',
})
export class ReportingPageComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly datePickerType = DatePickerType;
  protected readonly activeMonth = signal<Date>(new Date());

  protected notificationService = inject(NotificationService);
  protected activityService = inject(ActivityService);
  protected translateService = inject(TranslateService);
  protected bookedDays = signal<BookedDay[]>([]);

  constructor() {
    effect(() => {
      this.activityService
        .getUsersWithActivities(this.activeMonth())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((bookedDays) => {
          this.bookedDays.set(bookedDays);
        });
    });
  }

  changeDate(event: Date) {
    const date = event instanceof Date ? event : new Date(event);

    if (isNaN(date.getTime())) {
      const message = this.translateService.instant(
        'reporting.page.monthChangedError'
      );
      const status = this.translateService.instant(
        'reporting.page.monthChangedStatus'
      );
      this.notificationService.openSnackBar(message, status);
      console.error('Invalid date provided:', event);
      return;
    }

    const formattedDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    this.activeMonth.set(formattedDate);
  }
}
