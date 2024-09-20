import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReportingMonthOverviewComponent } from '../../components/reporting-month-overview/reporting-month-overview.component';
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
import { MatDialog } from '@angular/material/dialog';
import { filter, take } from 'rxjs';
import { ActivityModalComponent } from 'src/app/features/activity/components/activity-modal/activity-modal.component';
import { Activity } from 'src/app/shared/models/activity';
import {
  DeleteConfirmationModalComponent,
  deleteConfirmationModalPreset,
} from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';

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

  protected readonly datePickerType = DatePickerType;
  protected readonly activeMonth = computed(
    () => this.store.filter().activeMonth ?? new Date()
  );

  private readonly dialog = inject(MatDialog);

  protected notificationService = inject(NotificationService);
  protected translateService = inject(TranslateService);
  protected readonly icons = Icons;

  protected displayActivitiesView = signal<boolean>(false);

  ngOnInit(): void {
    this.store.updateFilter({
      date: null,
      project: null,
      activeMonth: this.activeMonth(),
    });
    this.store.loadProjects();
    this.store.loadUsers();
    this.store.loadActivityTypes();
    this.store.loadMonthYearReport(this.store.filter());
    this.store.loadProjects();
  }
  protected updateFilter(key: string, value) {
    switch (key) {
      case 'date':
        this.store.updateFilter({
          date: value,
          project: null,
          activeMonth: this.store.filter().activeMonth,
        });
        this.store.loadMonthYearReport(this.store.filter());
        break;
      case 'project':
        this.store.updateFilter({
          project: value,
          date: this.store.filter()?.date,
          activeMonth: this.store.filter().activeMonth,
        });
        this.store.loadMonthYearReport(this.store.filter());
        break;

      default:
        break;
    }
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

  addActivityToDate(dateKey: string) {
    this.dialog
      .open(ActivityModalComponent, {
        data: {
          activityProjects: this.store.projects(),
          activityTypes: this.store.activityTypes(),
          users: this.store.users(),
        },
        panelClass: 'full-width-dialog',
      })
      .afterClosed()
      .pipe(
        filter((activity: Activity) => !!activity),
        take(1)
      )
      .subscribe((activity: Activity) => {
        activity.date = new Date(dateKey);
        this.store.addActivityToMonthYearReport([
          { ...activity, projectId: activity?.project?.id },
          dateKey,
          this.store.users(),
          activity.employeeId,
        ]);
        // this.store.loadMonthYearReport(this.store.filter());
      });
  }

  editActivityOfDate(event: { activity: Activity; dateKey: string }) {
    const [activity, dateKey] = [event.activity, event.dateKey];
    const { date, workedTime, ...activityWithoutUnnecessary } = activity;
    this.dialog
      .open(ActivityModalComponent, {
        data: {
          activity: activityWithoutUnnecessary,
          activityProjects: this.store.projects(),
          activityTypes: this.store.activityTypes(),
        },
        panelClass: 'full-width-dialog',
      })
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        take(1)
      )
      .subscribe((updatedActivity: Activity) => {
        const { project, ...updatedActivityFormatted } = updatedActivity;
        updatedActivityFormatted.projectId = project?.id;

        if (updatedActivity.workedTime !== activity.workedTime) {
          this.store.editActivityOfMonthYearReport([
            updatedActivityFormatted,
            dateKey,
            activity.workedTime,
          ]);
        } else {
          this.store.editActivityOfMonthYearReport([
            updatedActivityFormatted,
            dateKey,
          ]);
        }
        // this.store.loadMonthYearReport(this.store.filter());
      });
  }

  deleteActivityFromDate(event: { activity: Activity; dateKey: string }) {
    const [activity, dateKey] = [event.activity, event.dateKey];
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(
        filter((deleteConfirmation) => deleteConfirmation === true),
        take(1)
      )
      .subscribe((_) => {
        this.store.deleteActivityFromMonthYearReport([activity, dateKey]);
      });
  }
}
