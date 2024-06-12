import { ActivityDialogComponent } from './../../../../ng-modules/reporting/components/activity-dialog/activity-dialog.component';
import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardTitle, MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { EntityPageHeaderComponent } from 'src/app/shared/components/entity-page-header/entity-page-header.component';
import { Activity } from 'src/app/shared/models/activity';
import { Icons } from 'src/app/shared/models/icons.enum';
import { ActivityService } from '../../services/activity-service/activity.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage-service/localstorage.service';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { filter, map, switchMap, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/features/project/services/project-service/project.service';
import { MatDialog } from '@angular/material/dialog';
import {
  DeleteConfirmationModalComponent,
  deleteConfirmationModalPreset,
} from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import {
  DuplicateActivityModalComponent,
  duplicateActivityModalPreset,
} from '../../components/duplicate-activity-modal/duplicate-activity-modal.component';

@Component({
  selector: 'app-activity-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    EntityPageHeaderComponent,
    MatCard,
    MatCardTitle,
    MatCardActions,
    MatIcon,
    MatButton,
    MatIconButton,
    EntityItemComponent,
  ],
  templateUrl: './activity-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(ActivityService);
  private readonly projectService = inject(ProjectService);
  private readonly localStorage = inject(LocalStorageService);
  private readonly datePipe = inject(DatePipe);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  protected readonly icons = Icons;

  protected currentDate = signal(new Date());
  protected projects = toSignal(
    this.projectService.getProjectsUser(this.localStorage.userId)
  );
  private rawActivities: Signal<Activity[]> = toSignal(
    toObservable(this.currentDate).pipe(
      switchMap((currentDateVal) =>
        this.service.getActivitiesByDateEmployeeId(
          this.localStorage.userId,
          this.datePipe.transform(currentDateVal, 'dd/MM/yyyy')
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    )
  );
  public activities = computed(() => signal(this.rawActivities()));
  constructor() {
    this.route.queryParams
      .pipe(
        map(({ date }) => date),
        filter((date) => !!date)
      )
      .subscribe((date) => {
        this.currentDate.set(new Date(date));
      });
  }

  deleteAllActivity() {
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(
        filter((deleteConfirmation) => deleteConfirmation === true),
        switchMap((_) => {
          return this.service.deleteAllActivitiesOfUserDay(
            this.localStorage.userId,
            this.datePipe.transform(this.currentDate(), 'yyyy-MM-dd')
          );
        }),
        take(1)
      )
      .subscribe((_) => {
        this.activities().set([]);
      });
  }

  addActivity() {
    this.dialog
      .open(ActivityDialogComponent, {
        panelClass: 'full-width-dialog',
      })
      .afterClosed()
      .pipe(
        filter((activity: Activity) => !!activity),
        switchMap((activity: Activity) => {
          return this.service
            .addActivity({
              ...activity,
              date: this.datePipe.transform(
                this.currentDate?.toString(),
                'dd/MM/yyyy'
              ),
            })
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((activity: Activity) => {
        this.activities().update((activities) => [...activities, activity]);
      });
  }

  duplicateActivity(activity: Activity) {
    this.dialog
      .open(DuplicateActivityModalComponent, {
        ...duplicateActivityModalPreset,
        data: activity,
      })
      .afterClosed()
      .pipe(
        filter((activityDuplication) => !!activityDuplication),
        switchMap((activityDuplication) =>
          this.service.addDuplicates(activityDuplication)
        ),
        take(1)
      )
      .subscribe();
  }

  navigateToPreviousDate() {
    this.currentDate.update((selectedDate) => {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() - 1);
      return nextDate;
    });
  }

  navigateToNextDate() {
    this.currentDate.update((selectedDate) => {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);
      return nextDate;
    });
  }

  editActivity(activity: Activity) {
    this.dialog
      .open(ActivityDialogComponent, {
        data: { activity: activity },
        panelClass: 'full-width-dialog',
      })
      .afterClosed()
      .pipe(
        filter((activity: Activity) => !!activity),
        switchMap((updatedActivity: Activity) => {
          return this.service
            .updateActivity({
              ...updatedActivity,
            })
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((updatedActivity: Activity) => {
        this.activities().update((activities) =>
          activities.map((activity) => {
            if (updatedActivity?.id === activity?.id) return updatedActivity;
            return activity;
          })
        );
      });
  }

  deleteActivity(id: string) {
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(
        filter((deleteConfirmation) => deleteConfirmation === true),
        switchMap((_) => {
          return this.service
            .deleteActivity(id)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((_) => {
        this.activities().update((activities) =>
          activities.filter((activity) => activity.id !== id)
        );
      });
  }
}
