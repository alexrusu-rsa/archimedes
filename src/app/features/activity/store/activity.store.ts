import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ActivityService } from 'src/app/features/activity/services/activity-service/activity.service';
import { Activity } from 'src/app/shared/models/activity';
import { Project } from 'src/app/shared/models/project';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { LocalStorageService } from '../../../shared/services/localstorage-service/localstorage.service';
import { ActivityFilter } from 'src/app/features/activity/models/activity-filter.model';
import { DatePipe } from '@angular/common';
import { tapResponse } from '@ngrx/operators';
import { ActivityDuplication } from 'src/app/features/activity/models/activity-duplication.model';
import { ProjectService } from '../../project/services/project-service/project.service';

type ActivityState = {
  activities: Activity[];
  activityTypes: string[];
  projects: Project[];
  isLoading: boolean;
  filter: { project?: Project; date?: Date };
};

const initialState: ActivityState = {
  activities: [],
  activityTypes: [],
  projects: [],
  isLoading: false,
  filter: { project: null, date: new Date() },
};

export const ActivityStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      activityService = inject(ActivityService),
      projectService = inject(ProjectService),
      localStorage = inject(LocalStorageService),
      datePipe = inject(DatePipe)
    ) => ({
      updateFilter(filter: ActivityFilter) {
        patchState(store, { filter });
      },
      loadActivityTypes: rxMethod<void>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(() =>
            activityService.getAllActivityTypes().pipe(
              tapResponse({
                next: (activityTypes) =>
                  patchState(store, {
                    activityTypes: activityTypes,
                  }),
                // eslint-disable-next-line no-console
                error: (error) => console.error(error),
              })
            )
          )
        )
      ),
      loadProjects: rxMethod<void>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(() =>
            projectService.getProjectsUser(localStorage?.userId).pipe(
              tapResponse({
                next: (projects: Project[]) =>
                  patchState(store, {
                    projects,
                  }),
                // eslint-disable-next-line no-console
                error: (error) => console.error(error),
              })
            )
          )
        )
      ),
      loadActivitiesByFilter: rxMethod<ActivityFilter>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((filter: ActivityFilter) =>
            activityService
              .getActivitiesByDateEmployeeId(
                localStorage?.userId,
                datePipe.transform(filter?.date, 'dd/MM/yyyy')
              )
              .pipe(
                tapResponse({
                  next: (activities: Activity[]) =>
                    patchState(store, {
                      activities: activities.filter((activity: Activity) => {
                        if (!filter?.project) return !!activity;

                        if (filter?.project?.id === 'other')
                          return !activity?.project;
                        else
                          return activity?.project?.id === filter?.project?.id;
                      }),
                    }),
                  // eslint-disable-next-line no-console
                  error: (error) => console.error(error),
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
          )
        )
      ),
      addActivity: rxMethod<Activity>(
        pipe(
          debounceTime(300),
          switchMap((activity) =>
            activityService
              .addActivity({
                ...activity,
                employeeId: localStorage?.userId,
                projectId:
                  activity?.project?.id === 'other'
                    ? null
                    : activity?.project?.id,
                date: datePipe.transform(store.filter()?.date, 'dd/MM/yyyy'),
              })
              .pipe(
                tapResponse({
                  next: (activity: Activity) => {
                    if (!store.filter()?.project)
                      patchState(store, {
                        isLoading: true,
                        activities: [...store.activities(), activity],
                      });
                    else {
                      if (
                        store.filter()?.project?.id === 'other' &&
                        !activity?.project
                      )
                        patchState(store, {
                          isLoading: true,
                          activities: [...store.activities(), activity],
                        });

                      if (store.filter()?.project?.id === activity?.project?.id)
                        patchState(store, {
                          isLoading: true,
                          activities: [...store.activities(), activity],
                        });
                    }
                  },
                  // eslint-disable-next-line no-console
                  error: (error) => console.error(error),
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
          )
        )
      ),
      editActivity: rxMethod<Activity>(
        pipe(
          debounceTime(300),
          switchMap((activity) =>
            activityService
              .updateActivity({
                ...activity,
                employeeId: localStorage?.userId,
                projectId:
                  activity?.projectId === 'other' ? null : activity?.projectId,
                date: datePipe.transform(store.filter()?.date, 'dd/MM/yyyy'),
              })
              .pipe(
                tapResponse({
                  next: (editedActivity: Activity) => {
                    //if no filters, just update
                    if (!store.filter()?.project) {
                      patchState(store, {
                        isLoading: true,
                        activities: store
                          .activities()
                          ?.map((mappedActivity) => {
                            if (editedActivity.id === mappedActivity.id)
                              return editedActivity;
                            return mappedActivity;
                          }),
                      });
                    } else {
                      // If the selected filter is 'other'
                      if (store.filter()?.project?.id === 'other') {
                        // Special case: If the activity has a project (not null), filter it out
                        if (editedActivity?.project) {
                          patchState(store, {
                            isLoading: true,
                            activities: store
                              .activities()
                              ?.filter(
                                (filteredActivity) =>
                                  filteredActivity.id !== editedActivity.id
                              ),
                          });
                        } else {
                          // If the activity does not have a project (null), update the activity
                          patchState(store, {
                            isLoading: true,
                            activities: store
                              .activities()
                              ?.map((mappedActivity) => {
                                if (editedActivity.id === mappedActivity.id)
                                  return editedActivity;
                                return mappedActivity;
                              }),
                          });
                        }
                      } else {
                        // If the selected filter matches the activity's project, update the activity
                        if (
                          store.filter()?.project?.id ===
                          editedActivity?.project?.id
                        ) {
                          patchState(store, {
                            isLoading: true,
                            activities: store
                              .activities()
                              ?.map((mappedActivity) => {
                                if (editedActivity.id === mappedActivity.id)
                                  return editedActivity;
                                return mappedActivity;
                              }),
                          });
                        } else {
                          // If the selected filter does not match the activity's project, filter it out
                          patchState(store, {
                            isLoading: true,
                            activities: store
                              .activities()
                              ?.filter(
                                (filteredActivity) =>
                                  filteredActivity.id !== editedActivity.id
                              ),
                          });
                        }
                      }
                    }
                  },
                  // eslint-disable-next-line no-console
                  error: (error) => console.error(error),
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
          )
        )
      ),
      deleteAllActivity: rxMethod<void>(
        pipe(
          debounceTime(300),
          switchMap((_) =>
            activityService
              .deleteAllActivitiesOfUserDay(
                localStorage?.userId,
                datePipe
                  .transform(store.filter()?.date, 'yyyy-MM-dd')
                  .toString()
              )
              .pipe(
                tapResponse({
                  next: (_) => {
                    patchState(store, {
                      isLoading: true,
                      activities: [],
                    });
                  },
                  // eslint-disable-next-line no-console
                  error: (error) => console.error(error),
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
          )
        )
      ),
      delete: rxMethod<string>(
        pipe(
          debounceTime(300),
          switchMap((id: string) =>
            activityService.deleteActivity(id).pipe(
              tapResponse({
                next: (_) => {
                  patchState(store, {
                    isLoading: true,
                    activities: store
                      .activities()
                      .filter((activity) => activity.id !== id),
                  });
                },
                // eslint-disable-next-line no-console
                error: (error) => console.error(error),
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      duplicateActivity: rxMethod<ActivityDuplication>(
        pipe(
          debounceTime(300),
          switchMap((activityDuplication: ActivityDuplication) =>
            activityService.addDuplicates(activityDuplication).pipe(
              tapResponse({
                next: (_) => {
                  const dateInRange = ({
                    activity,
                    startDate,
                    endDate,
                  }: ActivityDuplication) => {
                    // Parse activity.date from string to Date
                    const [day, month, year] = activity.date
                      .split('/')
                      .map(Number);
                    const activityDate = new Date(year, month - 1, day); // Note: month is zero-based in JavaScript Date

                    // Check if activityDate is between startDate and endDate
                    return activityDate >= startDate && activityDate <= endDate;
                  };

                  if (dateInRange(activityDuplication))
                    patchState(store, {
                      isLoading: true,
                      activities: [
                        ...store.activities(),
                        activityDuplication.activity,
                      ],
                    });
                },
                // eslint-disable-next-line no-console
                error: (error) => console.error(error),
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      nextDate() {
        const nextDate = new Date(store.filter()?.date);
        nextDate.setDate(store.filter()?.date?.getDate() + 1);
        patchState(store, { filter: { date: nextDate, project: null } });
      },
      previousDate() {
        const nextDate = new Date(store.filter()?.date);
        nextDate.setDate(store.filter()?.date?.getDate() - 1);
        patchState(store, { filter: { date: nextDate, project: null } });
      },
    })
  ),
  withHooks({
    onInit({ loadActivitiesByFilter, filter }) {
      loadActivitiesByFilter(filter);
    },
  })
);
