import { Component, inject, input, OnInit, signal } from '@angular/core';
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { MatCardActions, MatCardTitle } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { WorkedTimePipe } from 'src/app/features/activity/pipes/worked-time.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { Icons } from 'src/app/shared/models/icons.enum';
import { filter, take } from 'rxjs';
import {
  DeleteConfirmationModalComponent,
  deleteConfirmationModalPreset,
} from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { Activity } from 'src/app/shared/models/activity';
import { ActivityStore } from 'src/app/features/activity/store/activity.store';
import { MatDialog } from '@angular/material/dialog';
import { ActivityModalComponent } from 'src/app/features/activity/components/activity-modal/activity-modal.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { TimePipe } from 'src/app/shared/pipes/time.pipe';
import { Days } from '../../models/days';

@Component({
  selector: 'app-reporting-activities-view',
  standalone: true,
  imports: [
    EntityItemComponent,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCardActions,
    CommonModule,
    DatePipe,
    WorkedTimePipe,
    TranslateModule,
    TimePipe,
    MatCardTitle,
  ],
  providers: [],
  styles: `
    @use 'src/styles/variables.sass' as variables
    .orange
      color: variables.$rsasoft-partially-reported-day
    .green
      color: variables.$rsasoft-fully-reported-day
  `,
  templateUrl: './reporting-activities-view.component.html',
})
export class ReportingActivitiesViewComponent implements OnInit {
  protected readonly monthYearReport = input<Days>();
  protected readonly icons = Icons;
  private readonly dialog = inject(MatDialog);
  public readonly store = inject(ActivityStore);
  protected readonly activeMonth = signal<Date>(new Date());

  ngOnInit(): void {
    this.store.loadProjects();
    this.store.loadUsers();
    this.store.loadActivityTypes();
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
      .pipe(filter((activity: Activity) => !!activity))
      .subscribe((activity: Activity) => {
        activity.date = new Date(dateKey);
        this.store.addActivityToMonthYearReport([
          activity,
          dateKey,
          this.store.users(),
          activity.employeeId,
        ]);
      });
  }

  editActivityOfDate(activity: Activity, dateKey: string) {
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
      });
  }

  deleteActivityFromDate(activity: Activity, dateKey: string) {
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(filter((deleteConfirmation) => deleteConfirmation === true))
      .subscribe((_) => {
        this.store.deleteActivityFromMonthYearReport([activity, dateKey]);
      });
  }

  convertTimeToHours(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  }
}
