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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './reporting-page.component.html',
})
export class ReportingPageComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly datePickerType = DatePickerType;
  protected readonly activeMonth = signal<Date>(new Date());

  protected activityService = inject(ActivityService);
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

  changeDate(event) {
    const date = event._d as Date;
    const formattedDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1)
    );
    this.activeMonth.set(formattedDate);
  }
}
