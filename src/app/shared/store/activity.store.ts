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
import { LocalStorageService } from '../services/localstorage-service/localstorage.service';
import { ActivityFilter } from 'src/app/features/activity/models/activity-filter.model';
import { DatePipe } from '@angular/common';
import { tapResponse } from '@ngrx/operators';

type ActivityState = {
  activities: Activity[];
  isLoading: boolean;
  filter: { project?: Project; date?: Date };
};

const initialState: ActivityState = {
  activities: [],
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
      localStorage = inject(LocalStorageService),
      datePipe = inject(DatePipe)
    ) => ({
      updateFilter(filter: ActivityFilter) {
        patchState(store, { filter });
      },
      loadActivitiesByFilter: rxMethod<ActivityFilter>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((filter: ActivityFilter) =>
            activityService
              .getActivitiesByDateEmployeeId(
                localStorage.userId,
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
      deleteAllActivity: rxMethod<void>(
        pipe(
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
    })
  ),
  withHooks({
    onInit({ loadActivitiesByFilter, filter }) {
      loadActivitiesByFilter(filter);
    },
  })
);
