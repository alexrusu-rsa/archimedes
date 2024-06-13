import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
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
import { combineLatest, filter, map, of, switchMap, take } from 'rxjs';
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
import { ActivityModalComponent } from '../../components/activity-modal/activity-modal.component';
import { OrderByPipe } from '../../pipes/order-by.pipe';
import { WorkedTimePipe } from '../../pipes/worked-time.pipe';
import { ActivityFilters } from '../../models/activity-filters.model';

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
    OrderByPipe,
    WorkedTimePipe,
  ],
  templateUrl: './activity-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(ActivityService);
  private readonly projectService = inject(ProjectService);
  private readonly localStorage = inject(LocalStorageService);
  private readonly datePipe = inject(DatePipe);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  protected readonly icons = Icons;

  protected filters = signal<ActivityFilters>({
    date: new Date(),
    project: null,
  });
  protected projects = toSignal(
    this.projectService.getProjectsUser(this.localStorage.userId),
    { initialValue: [] }
  );
  private rawActivities: Signal<Activity[]> = toSignal(
    toObservable(this.filters).pipe(
      switchMap((filters) =>
        combineLatest([
          this.service.getActivitiesByDateEmployeeId(
            this.localStorage.userId,
            this.datePipe.transform(filters?.date, 'dd/MM/yyyy')
          ),
          of(filters),
        ])
      ),
      map(([activities, filters]) => {
        if (filters?.project?.id === 'other')
          return activities.filter((activity) => !activity?.project);
        if (filters?.project?.id)
          return activities.filter(
            (activity) => activity?.project?.id === filters?.project?.id
          );
        return activities;
      })
    )
  );
  protected activities = computed(() => signal(this.rawActivities()));
  protected activityTypes = toSignal(this.service.getAllActivityTypes(), {
    initialValue: {},
  });

  protected updateFilters(key, value) {
    if (key === 'date') this.filters.set({ date: value, project: null });
    else this.filters.set({ ...this.filters(), [key]: value });
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        map(({ date }) => date),
        filter((date) => !!date)
      )
      .subscribe((date) => {
        this.updateFilters('date', new Date(date));
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
            this.datePipe.transform(this.filters()?.date, 'yyyy-MM-dd')
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
      .open(ActivityModalComponent, {
        data: {
          activityProjects: this.projects(),
          activityTypes: Object.values(this.activityTypes()),
        },
        panelClass: 'full-width-dialog',
      })
      .afterClosed()
      .pipe(
        filter((activity: Activity) => !!activity),
        switchMap((activity: Activity) => {
          return this.service
            .addActivity({
              ...activity,
              employeeId: this.localStorage.userId,
              projectId: this.projects().find(
                (project) => project.projectName === activity['projectName']
              )?.id,
              date: this.datePipe.transform(this.filters()?.date, 'dd/MM/yyyy'),
            })
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((activity: Activity) => {
        if (
          activity?.project &&
          this.filters()?.project?.id === activity?.project?.id
        )
          this.activities().update((activities) => [...activities, activity]);
        if (
          activity?.project === null &&
          this.filters()?.project?.id === 'other'
        )
          this.activities().update((activities) => [...activities, activity]);
        if (!this.filters()?.project?.id)
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
    this.filters.update((filters) => {
      const nextDate = new Date(filters?.date);
      nextDate.setDate(filters?.date.getDate() - 1);
      return { date: nextDate };
    });
  }

  navigateToNextDate() {
    this.filters.update((filters) => {
      const nextDate = new Date(filters?.date);
      nextDate.setDate(filters?.date.getDate() + 1);
      return { date: nextDate };
    });
  }

  editActivity(activity: Activity) {
    const {
      id,
      employeeId,
      date,
      projectId,
      project,
      workedTime,
      ...activityWithoutUnecessary
    } = activity;
    this.dialog
      .open(ActivityModalComponent, {
        data: {
          activity: {
            ...activityWithoutUnecessary,
            projectName: activity?.project?.projectName
              ? activity?.project?.projectName
              : 'other',
          },
          activityProjects: this.projects(),
          activityTypes: Object.values(this.activityTypes()),
        },
        panelClass: 'full-width-dialog',
      })
      .afterClosed()
      .pipe(
        filter((activity: Activity) => !!activity),
        switchMap((updatedActivity: Activity) => {
          const { projectName, ...updatedActivityWithoutProjectName } =
            updatedActivity;
          return this.service
            .updateActivity({
              ...updatedActivityWithoutProjectName,
              id: activity?.id,
              employeeId: activity?.employeeId,
              date: activity?.date,
              projectId:
                this.projects()?.find(
                  (project) =>
                    project?.projectName === updatedActivity?.projectName
                )?.id || null,
            })
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((updatedActivity: Activity) => {
        this.activities().update((activities) => {
          if (this.filters().project?.id)
            return activities
              .map((activity) => {
                if (updatedActivity?.id === activity?.id)
                  return updatedActivity;
                return activity;
              })
              .filter(
                (activity) =>
                  activity?.project?.id === this.filters().project.id ||
                  (this.filters().project.id === 'other' && !activity.project)
              );

          // base case
          return activities.map((activity) => {
            if (updatedActivity?.id === activity?.id) return updatedActivity;
            return activity;
          });
        });
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
