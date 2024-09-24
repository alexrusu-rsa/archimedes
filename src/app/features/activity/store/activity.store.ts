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
import { Days } from '../../reporting/models/days';
import { User } from 'src/app/shared/models/user';
import { UserService } from '../../user/services/user-service/user.service';
import { calculateUpdatedTime } from 'src/app/shared/utils/date-time.utils';

type ActivityState = {
  activities: Activity[];
  activityTypes: string[];
  projectsOfCurrentUser: Project[];
  projects: Project[];
  users: User[];
  projectsOfUser: Project[];
  isLoading: boolean;
  filter: { project?: Project; date?: Date; activeMonth?: Date; user?: User };
  monthYearReport: Days;
};

const initialState: ActivityState = {
  activities: [],
  activityTypes: [],
  projectsOfCurrentUser: [],
  projects: [],
  users: [],
  projectsOfUser: [],
  isLoading: false,
  filter: { project: null, date: new Date(), activeMonth: null, user: null },
  monthYearReport: {} as Days,
};

export const ActivityStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      activityService = inject(ActivityService),
      projectService = inject(ProjectService),
      userService = inject(UserService),
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
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            activityService.getAllActivityTypes().pipe(
              tapResponse({
                next: (activityTypes) =>
                  patchState(store, {
                    activityTypes: activityTypes,
                  }),

                error: (error) => {
                  // eslint-disable-next-line no-console
                  console.error(error);
                  patchState(store, { isLoading: false });
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      loadProjects: rxMethod<void>(
        pipe(
          debounceTime(300),
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            projectService.getProjects().pipe(
              tapResponse({
                next: (projects: Project[]) =>
                  patchState(store, {
                    projects,
                  }),
                error: (error) => {
                  // eslint-disable-next-line no-console
                  console.error(error);
                  patchState(store, { isLoading: false });
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      loadProjectsOfUser: rxMethod<void>(
        pipe(
          debounceTime(300),
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            projectService.getProjectsUser().pipe(
              tapResponse({
                next: (projectsOfUser: Project[]) =>
                  patchState(store, {
                    projectsOfUser,
                  }),
                error: (error) => {
                  // eslint-disable-next-line no-console
                  console.error(error);
                  patchState(store, { isLoading: false });
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      loadUsers: rxMethod<void>(
        pipe(
          debounceTime(300),
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            userService.getUsers().pipe(
              tapResponse({
                next: (users: User[]) =>
                  patchState(store, {
                    users,
                  }),

                error: (error) => {
                  // eslint-disable-next-line no-console
                  console.error(error);
                  patchState(store, { isLoading: false });
                },
                finalize: () => patchState(store, { isLoading: false }),
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
              .getActivitiesByDateEmployeeId(localStorage?.userId, filter?.date)
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
                  error: (error) => {
                    // eslint-disable-next-line no-console
                    console.error(error);
                    patchState(store, { isLoading: false });
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
          )
        )
      ),
      addActivity: rxMethod<[Activity, Date?, string?]>( // Accept an array of Activity, Date, and employeeId
        pipe(
          debounceTime(300),
          tap(() => patchState(store, { isLoading: true })),
          switchMap(
            (
              [activity, date, employeeId] // Destructure the parameters here
            ) =>
              activityService
                .addActivity({
                  ...activity,
                  employeeId: employeeId ?? localStorage?.userId, // Use provided employeeId or fallback to localStorage
                  projectId: activity?.project?.id ?? null,
                  date: date || store.filter?.date(),
                })
                .pipe(
                  tapResponse({
                    next: (newActivity: Activity) => {
                      if (!store.filter()?.project) {
                        patchState(store, {
                          isLoading: true,
                          activities: [...store.activities(), newActivity],
                        });
                      } else {
                        if (
                          store.filter()?.project?.id === 'other' &&
                          !newActivity?.project
                        ) {
                          patchState(store, {
                            isLoading: true,
                            activities: [...store.activities(), newActivity],
                          });
                        }

                        if (
                          store.filter()?.project?.id ===
                          newActivity?.project?.id
                        ) {
                          patchState(store, {
                            isLoading: true,
                            activities: [...store.activities(), newActivity],
                          });
                        }
                      }
                    },

                    error: (error) => {
                      // eslint-disable-next-line no-console
                      console.error(error);
                      patchState(store, { isLoading: false });
                    },
                    finalize: () => patchState(store, { isLoading: false }),
                  })
                )
          )
        )
      ),

      editActivity: rxMethod<Activity>(
        pipe(
          debounceTime(300),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((activity) =>
            activityService
              .updateActivity({
                ...activity,
                employeeId: localStorage?.userId,
                projectId: activity?.projectId ?? null,
                date: activity?.date,
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
                  error: (error) => {
                    // eslint-disable-next-line no-console
                    console.error(error);
                    patchState(store, { isLoading: false });
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
          )
        )
      ),
      deleteAllActivity: rxMethod<void>(
        pipe(
          debounceTime(300),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((_) =>
            activityService
              .deleteAllActivitiesOfUserDay(
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

                  error: (error) => {
                    // eslint-disable-next-line no-console
                    console.error(error);
                    patchState(store, { isLoading: false });
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                })
              )
          )
        )
      ),
      delete: rxMethod<string>(
        pipe(
          debounceTime(300),
          tap(() => patchState(store, { isLoading: true })),
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
                error: (error) => {
                  // eslint-disable-next-line no-console
                  console.error(error);
                  patchState(store, { isLoading: false });
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      duplicateActivity: rxMethod<ActivityDuplication>(
        pipe(
          debounceTime(300),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((activityDuplication: ActivityDuplication) =>
            activityService.addDuplicates(activityDuplication).pipe(
              tapResponse({
                next: (_) => {
                  const dateInRange = ({
                    activity,
                    startDate,
                    endDate,
                  }: ActivityDuplication) => {
                    const activityDate = activity?.date;

                    return activityDate >= startDate && activityDate <= endDate;
                  };

                  if (dateInRange(activityDuplication))
                    patchState(store, {
                      activities: [
                        ...store.activities(),
                        activityDuplication.activity,
                      ],
                    });
                },
                error: (error) => {
                  // eslint-disable-next-line no-console
                  console.error(error);
                  patchState(store, { isLoading: false });
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      loadMonthYearReport: rxMethod<ActivityFilter>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((filter: ActivityFilter) =>
            activityService.getMonthReport(filter.activeMonth, filter).pipe(
              tapResponse({
                next: (monthYearReport) =>
                  patchState(store, {
                    monthYearReport: monthYearReport,
                  }),
                error: (error) => {
                  // eslint-disable-next-line no-console
                  console.error(error);
                  patchState(store, { isLoading: false });
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      addActivityToMonthYearReport: rxMethod<
        [Activity, string, User[], string]
      >(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(([activity, dateKey, users, employeeId]) =>
            activityService.addActivity(activity).pipe(
              tapResponse({
                next: (newActivity) => {
                  const user = users.find((user) => user.id === employeeId);
                  const formattedActivity = {
                    ...newActivity,
                    user,
                    project: activity?.project,
                    projectId: activity?.project?.id,
                  };
                  const updatedMonthYearReport = store.monthYearReport();

                  const currentWorkedTime =
                    updatedMonthYearReport[dateKey].timeBooked;

                  const updatedTime = calculateUpdatedTime(
                    currentWorkedTime,
                    newActivity.workedTime
                  );

                  if (
                    store.filter()?.project?.id === 'other' &&
                    !formattedActivity.project
                  ) {
                    updatedMonthYearReport[dateKey].timeBooked = updatedTime;

                    updatedMonthYearReport[dateKey].activities.push(
                      formattedActivity
                    );

                    patchState(store, {
                      monthYearReport: updatedMonthYearReport,
                    });
                  }
                  if (!store.filter()?.project) {
                    if (!store.filter()?.user) {
                      updatedMonthYearReport[dateKey].timeBooked = updatedTime;

                      updatedMonthYearReport[dateKey].activities.push(
                        formattedActivity
                      );

                      patchState(store, {
                        monthYearReport: updatedMonthYearReport,
                      });
                    } else {
                      if (store.filter().user?.id === newActivity.employeeId) {
                        console.log('case3');
                        updatedMonthYearReport[dateKey].timeBooked =
                          updatedTime;

                        updatedMonthYearReport[dateKey].activities.push(
                          formattedActivity
                        );

                        patchState(store, {
                          monthYearReport: updatedMonthYearReport,
                        });
                      }
                    }
                  }
                  if (
                    store.filter()?.project?.id === formattedActivity.projectId
                  ) {
                    if (!store.filter()?.user?.id) {
                      updatedMonthYearReport[dateKey].timeBooked = updatedTime;

                      updatedMonthYearReport[dateKey].activities.push(
                        formattedActivity
                      );

                      patchState(store, {
                        monthYearReport: updatedMonthYearReport,
                      });
                    }
                    if (store.filter()?.user?.id === newActivity.employeeId) {
                      updatedMonthYearReport[dateKey].timeBooked = updatedTime;

                      updatedMonthYearReport[dateKey].activities.push(
                        formattedActivity
                      );

                      patchState(store, {
                        monthYearReport: updatedMonthYearReport,
                      });
                    }
                  }
                },

                error: (error) => {
                  // eslint-disable-next-line no-console
                  console.error(error);
                  patchState(store, { isLoading: false });
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      editActivityOfMonthYearReport: rxMethod<[Activity, string, string?]>(
        pipe(
          debounceTime(300),
          tap(() => patchState(store, { isLoading: true })),
          switchMap(([activity, dateKey, timeToRemove]) =>
            activityService.updateActivity(activity).pipe(
              tapResponse({
                next: (updatedActivity) => {
                  const updatedMonthYearReport = store.monthYearReport();
                  const user = store
                    .users()
                    .find((user) => user.id === updatedActivity.employeeId);
                  updatedActivity.user = user;

                  const activitiesOfDay = updatedMonthYearReport[
                    dateKey
                  ].activities.map((activity) =>
                    activity.id === updatedActivity.id
                      ? updatedActivity
                      : activity
                  );

                  if (store.filter()?.user?.id !== updatedActivity.employeeId) {
                    const currentWorkedTime =
                      updatedMonthYearReport[dateKey].timeBooked;
                    const updatedTime = calculateUpdatedTime(
                      currentWorkedTime,
                      '00:00',
                      updatedActivity?.workedTime || '00:00'
                    );
                    updatedMonthYearReport[dateKey] = {
                      activities: activitiesOfDay.filter(
                        (activity) =>
                          activity?.project?.id !== updatedActivity?.project?.id
                      ),
                      timeBooked: updatedTime,
                      expectedHours:
                        updatedMonthYearReport[dateKey].expectedHours,
                    };
                    patchState(store, {
                      monthYearReport: updatedMonthYearReport,
                      isLoading: false,
                    });
                    console.log(store.monthYearReport()[dateKey]);
                  }
                  if (
                    store.filter()?.project?.id !== updatedActivity?.project?.id
                  ) {
                    const currentWorkedTime =
                      updatedMonthYearReport[dateKey].timeBooked;
                    const updatedTime = calculateUpdatedTime(
                      currentWorkedTime,
                      '00:00',
                      updatedActivity?.workedTime || '00:00'
                    );
                    updatedMonthYearReport[dateKey] = {
                      activities: activitiesOfDay.filter(
                        (activity) =>
                          activity?.project?.id !== updatedActivity?.project?.id
                      ),
                      timeBooked: updatedTime,
                      expectedHours:
                        updatedMonthYearReport[dateKey].expectedHours,
                    };
                    patchState(store, {
                      monthYearReport: updatedMonthYearReport,
                      isLoading: false,
                    });
                    console.log(store.monthYearReport()[dateKey]);
                  }
                  if (
                    store.filter()?.project?.id === updatedActivity.project?.id
                  ) {
                    const currentWorkedTime =
                      updatedMonthYearReport[dateKey].timeBooked;
                    const updatedTime = calculateUpdatedTime(
                      currentWorkedTime,
                      updatedActivity?.workedTime || '00:00',
                      timeToRemove || '00:00'
                    );

                    updatedMonthYearReport[dateKey] = {
                      activities: activitiesOfDay,
                      timeBooked: updatedTime,
                      expectedHours:
                        updatedMonthYearReport[dateKey].expectedHours,
                    };
                    patchState(store, {
                      monthYearReport: updatedMonthYearReport,
                      isLoading: false,
                    });
                  }
                  if (!store.filter()?.project?.id) {
                    const currentWorkedTime =
                      updatedMonthYearReport[dateKey].timeBooked;
                    const updatedTime = calculateUpdatedTime(
                      currentWorkedTime,
                      updatedActivity?.workedTime || '00:00',
                      timeToRemove || '00:00'
                    );

                    updatedMonthYearReport[dateKey] = {
                      activities: activitiesOfDay,
                      timeBooked: updatedTime,
                      expectedHours:
                        updatedMonthYearReport[dateKey].expectedHours,
                    };
                    patchState(store, {
                      monthYearReport: updatedMonthYearReport,
                    });
                  }
                },
                // eslint-disable-next-line no-console
                error: (error) => {
                  console.error(error);
                  patchState(store, { isLoading: false });
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),
      deleteActivityFromMonthYearReport: rxMethod<[Activity, string]>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          debounceTime(300),
          switchMap(([activity, dateKey]) =>
            activityService.deleteActivity(activity.id).pipe(
              tapResponse({
                next: (_) => {
                  const updatedMonthYearReport = store.monthYearReport();
                  updatedMonthYearReport[dateKey].activities =
                    updatedMonthYearReport[dateKey].activities.filter(
                      (cursorActivity) => cursorActivity.id !== activity.id
                    );

                  if (updatedMonthYearReport[dateKey].activities.length <= 0) {
                    delete updatedMonthYearReport[dateKey];
                  }

                  const updatedTimeBooked = calculateUpdatedTime(
                    updatedMonthYearReport[dateKey].timeBooked,
                    '00:00',
                    activity.workedTime
                  );

                  updatedMonthYearReport[dateKey].timeBooked =
                    updatedTimeBooked;
                  patchState(store, {
                    monthYearReport: updatedMonthYearReport,
                  });
                },
                error: (error) => {
                  // eslint-disable-next-line no-console
                  console.error(error);
                  patchState(store, { isLoading: false });
                },
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
