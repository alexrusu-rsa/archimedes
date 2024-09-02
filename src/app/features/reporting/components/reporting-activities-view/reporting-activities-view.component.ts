import { Component, inject, input, OnInit, signal } from '@angular/core';
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { MatCardActions, MatCardSubtitle } from '@angular/material/card';
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
import { BookedDay } from '../../models/booked-day';

@Component({
  selector: 'app-reporting-activities-view',
  standalone: true,
  imports: [
    EntityItemComponent,
    MatCardSubtitle,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCardActions,
    CommonModule,
    DatePipe,
    WorkedTimePipe,
    TranslateModule,
    TimePipe,
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
  protected readonly bookedDays = input<BookedDay[]>();
  protected readonly icons = Icons;
  private readonly dialog = inject(MatDialog);
  public readonly store = inject(ActivityStore);
  protected readonly activeMonth = signal<Date>(new Date());

  ngOnInit(): void {
    this.store.loadProjects();
    this.store.loadActivityTypes();
  }
  allUsersHaveNoActivities(bookedDay: BookedDay): boolean {
    return bookedDay.usersTimeBooked.every(
      (bookedUser) => bookedUser.user.activities.length === 0
    );
  }

  editActivity(activity: Activity, index: number) {
    const {
      id,
      employeeId,
      date,
      projectId,
      projectName,
      workedTime,
      ...activityWithoutUnecessary
    } = activity;

    console.log(employeeId, projectId);
    this.dialog
      .open(ActivityModalComponent, {
        data: {
          activity: {
            ...activityWithoutUnecessary,
            employee: employeeId,
            project: projectId,
          },
          activityProjects: this.store.projects(),
          activityTypes: this.store.activityTypes(),
        },
        panelClass: 'full-width-dialog',
      })
      .afterClosed()
      .pipe(
        filter((activity: Activity) => !!activity),
        take(1)
      )
      .subscribe(({ employee, project, ...updatedActivity }: Activity) => {
        this.store.editActivityOfBookedDay([
          { ...updatedActivity, projectId: project?.id, id },
          index,
        ]);
      });
  }

  addActivity(bookedDay: BookedDay, index: number) {
    this.dialog
      .open(ActivityModalComponent, {
        data: {
          activityProjects: this.store.projects(),
          activityTypes: this.store.activityTypes(),
          users: bookedDay.usersTimeBooked.map((user) => user.user.user),
          index: index,
        },
        panelClass: 'full-width-dialog',
      })
      .afterClosed()
      .pipe(filter((activity: Activity) => !!activity))
      .subscribe((activity: Activity) => {
        this.store.addActivityToBookedDay([
          activity,
          new Date(bookedDay.date),
          activity.employee,
          index,
        ]);
      });
  }

  deleteActivity(activity: Activity, bookedDay: BookedDay, index: number) {
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(filter((deleteConfirmation) => deleteConfirmation === true))
      .subscribe((_) => {
        this.store.deleteActivityFromBookedDay([
          activity,
          new Date(bookedDay.date),
          activity.employee,
          index,
        ]);
      });
  }

  convertTimeToHours(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  }
}
