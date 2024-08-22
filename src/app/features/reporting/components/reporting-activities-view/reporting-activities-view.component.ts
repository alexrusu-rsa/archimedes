import { Component, inject, input, OnInit } from '@angular/core';
import { BookedDay } from '../../models/booked-day';
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { MatCardActions, MatCardSubtitle } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { WorkedTimePipe } from 'src/app/features/activity/pipes/worked-time.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { Icons } from 'src/app/shared/models/icons.enum';
import { filter, take } from 'rxjs';
import {
  DuplicateActivityModalComponent,
  duplicateActivityModalPreset,
} from 'src/app/features/activity/components/duplicate-activity-modal/duplicate-activity-modal.component';
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
  templateUrl: './reporting-activities-view.component.html',
})
export class ReportingActivitiesViewComponent {
  protected readonly bookedDays = input<BookedDay[]>();
  protected readonly icons = Icons;
  private readonly dialog = inject(MatDialog);
  public readonly store = inject(ActivityStore);

  allUsersHaveNoActivities(bookedDay: BookedDay): boolean {
    return bookedDay.usersTimeBooked.every(
      (bookedUser) => bookedUser.user.activities.length === 0
    );
  }
  
  editActivity(activity: Activity) {
    const {
      id,
      employeeId,
      date,
      projectId,
      projectName,
      workedTime,
      ...activityWithoutUnecessary
    } = activity;
    this.dialog
      .open(ActivityModalComponent, {
        data: {
          activity: {
            ...activityWithoutUnecessary,
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
      .subscribe(({ project, ...updatedActivity }: Activity) => {
        this.store.editActivity({
          ...updatedActivity,
          projectId: project?.id,
          id,
        });
      });
  }
  addActivity() {
    this.dialog
      .open(ActivityModalComponent, {
        data: {
          activityProjects: this.store.projects(),
          activityTypes: this.store.activityTypes(),
        },
        panelClass: 'full-width-dialog',
      })
      .afterClosed()
      .pipe(filter((activity: Activity) => !!activity))
      .subscribe((activity: Activity) => {
        this.store.addActivity(activity);
      });
  }

  deleteActivity(id: string) {
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(filter((deleteConfirmation) => deleteConfirmation === true))
      .subscribe((_) => {
        this.store.delete(id);
      });
  }

  duplicateActivity(activity: Activity) {
    this.dialog
      .open(DuplicateActivityModalComponent, {
        ...duplicateActivityModalPreset,
        data: activity,
      })
      .afterClosed()
      .pipe(filter((activityDuplication) => !!activityDuplication))
      .subscribe((activityDuplication) => {
        this.store.duplicateActivity(activityDuplication);
      });
  }
}
