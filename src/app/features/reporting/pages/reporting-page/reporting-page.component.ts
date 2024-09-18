import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ReportingMonthOverviewComponent } from '../../components/reporting-month-overview/reporting-month-overview.component';
import { ActivityService } from 'src/app/features/activity/services/activity-service/activity.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { EntityPageHeaderComponent } from 'src/app/shared/components/entity-page-header/entity-page-header.component';
import { DatePickerType } from 'src/app/shared/models/date-picker-type.enum';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NotificationService } from 'src/app/core/services/notification-service/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ReportingActivitiesViewComponent } from '../../components/reporting-activities-view/reporting-activities-view.component';
import { ActivityStore } from 'src/app/features/activity/store/activity.store';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Icons } from 'src/app/shared/models/icons.enum';

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
    MatIcon,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReportingActivitiesViewComponent,
    MatProgressSpinnerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './reporting-page.component.html',
})
export class ReportingPageComponent implements OnInit {
  public readonly store = inject(ActivityStore);
  protected readonly icons = Icons;

  protected readonly datePickerType = DatePickerType;
  protected readonly activeMonth = computed(
    () => this.store.filter().activeMonth ?? new Date()
  );
  protected notificationService = inject(NotificationService);
  protected translateService = inject(TranslateService);

  protected displayActivitiesView = signal<boolean>(false);

  monthYearReportUpdated = signal<boolean>(false);

  ngOnInit(): void {
    this.store.updateFilter({
      date: null,
      project: null,
      activeMonth: this.activeMonth(),
    });
    this.store.loadMonthYearReport(this.store.filter());
  }

  disableActivitiesView() {
    this.displayActivitiesView.set(!this.displayActivitiesView());
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
      // eslint-disable-next-line no-console
      console.error('Invalid date provided:', event);
      return;
    }
    const formattedDate = new Date(date.getFullYear(), date.getMonth(), 1);

    this.store.updateFilter({
      date: null,
      project: null,
      activeMonth: formattedDate,
    });
    this.store.loadMonthYearReport(this.store.filter());
  }

  updateMonthOverview() {
    this.store.loadMonthYearReport(this.store.filter());
  }
}
