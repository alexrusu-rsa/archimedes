import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardTitle, MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { EntityPageHeaderComponent } from 'src/app/shared/components/entity-page-header/entity-page-header.component';
import { Icons } from 'src/app/shared/models/icons.enum';
import { LocalStorageService } from 'src/app/shared/services/localstorage-service/localstorage.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/features/project/services/project-service/project.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderByPipe } from '../../pipes/order-by.pipe';
import { WorkedTimePipe } from '../../pipes/worked-time.pipe';
import { ActivityStore } from 'src/app/shared/store/activity.store';
import { ActivityModalComponent } from '../../components/activity-modal/activity-modal.component';
import { Activity } from 'src/app/shared/models/activity';
import { ActivityService } from '../../services/activity-service/activity.service';
import {
  DeleteConfirmationModalComponent,
  deleteConfirmationModalPreset,
} from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';

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
  public readonly store = inject(ActivityStore);
  private readonly service = inject(ActivityService);
  private readonly projectService = inject(ProjectService);
  private readonly localStorage = inject(LocalStorageService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  protected readonly icons = Icons;
  protected projects = toSignal(
    this.projectService.getProjectsUser(this.localStorage.userId),
    { initialValue: [] }
  );
  protected activities = computed(() => this.store.activities());
  protected activityTypes = toSignal(this.service.getAllActivityTypes(), {
    initialValue: {},
  });

  ngOnInit() {
    this.route.queryParams
      .pipe(
        map(({ date }) => date),
        filter((date) => !!date)
      )
      .subscribe((date) => {
        this.updateFilter('date', new Date(date));
      });
  }

  protected updateFilter(key: string, value) {
    switch (key) {
      case 'date':
        this.store.updateFilter({
          date: value,
          project: null,
        });
        break;
      case 'project':
        this.store.updateFilter({
          project: value,
          date: this.store.filter()?.date,
        });
        break;
      default:
        break;
    }
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
      .pipe(filter((activity: Activity) => !!activity))
      .subscribe((activity: Activity) => {
        this.store.addActivity(activity);
      });
  }

  deleteAllActivity() {
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(filter((deleteConfirmation) => deleteConfirmation === true))
      .subscribe((_) => {
        this.store.deleteAllActivity();
      });
  }

  // duplicateActivity(activity: Activity) {
  //   this.dialog
  //     .open(DuplicateActivityModalComponent, {
  //       ...duplicateActivityModalPreset,
  //       data: activity,
  //     })
  //     .afterClosed()
  //     .pipe(
  //       filter((activityDuplication) => !!activityDuplication),
  //       switchMap((activityDuplication) =>
  //         this.service.addDuplicates(activityDuplication)
  //       ),
  //       take(1)
  //     )
  //     .subscribe();
  // }

  // navigateToPreviousDate() {
  //   this.updateFilter('date'.)
  //   this.filter.update((filters) => {
  //     const nextDate = new Date(filters?.date);
  //     nextDate.setDate(filters?.date.getDate() - 1);
  //     return { date: nextDate };
  //   });
  // }

  // navigateToNextDate() {
  //   this.filters.update((filters) => {
  //     const nextDate = new Date(filters?.date);
  //     nextDate.setDate(filters?.date.getDate() + 1);
  //     return { date: nextDate };
  //   });
  // }

  // editActivity(activity: Activity) {
  //   const {
  //     id,
  //     employeeId,
  //     date,
  //     projectId,
  //     project,
  //     workedTime,
  //     ...activityWithoutUnecessary
  //   } = activity;
  //   this.dialog
  //     .open(ActivityModalComponent, {
  //       data: {
  //         activity: {
  //           ...activityWithoutUnecessary,
  //           projectName: activity?.project?.projectName
  //             ? activity?.project?.projectName
  //             : 'other',
  //         },
  //         activityProjects: this.projects(),
  //         activityTypes: Object.values(this.activityTypes()),
  //       },
  //       panelClass: 'full-width-dialog',
  //     })
  //     .afterClosed()
  //     .pipe(
  //       filter((activity: Activity) => !!activity),
  //       switchMap((updatedActivity: Activity) => {
  //         const { projectName, ...updatedActivityWithoutProjectName } =
  //           updatedActivity;
  //         return this.service
  //           .updateActivity({
  //             ...updatedActivityWithoutProjectName,
  //             id: activity?.id,
  //             employeeId: activity?.employeeId,
  //             date: activity?.date,
  //             projectId:
  //               this.projects()?.find(
  //                 (project) =>
  //                   project?.projectName === updatedActivity?.projectName
  //               )?.id || null,
  //           })
  //           .pipe(takeUntilDestroyed(this.destroyRef));
  //       }),
  //       take(1)
  //     )
  //     .subscribe((updatedActivity: Activity) => {
  //       // TODO update state in store
  //       // this.activities().update((activities) => {
  //       //   // TODO handle 'other' project id in backend
  //       //   if (this.filters().project?.id)
  //       //     return activities
  //       //       .map((activity) => {
  //       //         if (updatedActivity?.id === activity?.id)
  //       //           return updatedActivity;
  //       //         return activity;
  //       //       })
  //       //       .filter(
  //       //         (activity) =>
  //       //           activity?.project?.id === this.filters().project.id ||
  //       //           (this.filters().project.id === 'other' && !activity.project)
  //       //       );
  //       //   // base case
  //       //   return activities.map((activity) => {
  //       //     if (updatedActivity?.id === activity?.id) return updatedActivity;
  //       //     return activity;
  //       //   });
  //       // });
  //     });
  // }

  // deleteActivity(id: string) {
  //   this.dialog
  //     .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
  //     .afterClosed()
  //     .pipe(
  //       filter((deleteConfirmation) => deleteConfirmation === true),
  //       switchMap((_) => {
  //         return this.service
  //           .deleteActivity(id)
  //           .pipe(takeUntilDestroyed(this.destroyRef));
  //       }),
  //       take(1)
  //     )
  //     .subscribe((_) => {
  //       // TODO update state in store
  //       // this.activities().update((activities) =>
  //       //   activities.filter((activity) => activity.id !== id)
  //       // );
  //     });
  // }
}
