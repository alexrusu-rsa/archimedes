import { DatePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  Inject,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Activity } from '../../../../models/activity';
import { User } from '../../../../models/user';
import { ActivityService } from '../../../../services/activity-service/activity.service';
import { UserLoginService } from '../../../../services/user-login-service/user-login.service';
import { ActivatedRoute } from '@angular/router';
import { ActivityDialogComponent } from '../activity-dialog/activity-dialog.component';
import { UserDateActivity } from 'src/app/models/userDataActivity';
import { DuplicateActivityDialogComponent } from '../duplicate-activity-dialog/duplicate-activity-dialog.component';
import { Customer } from 'src/app/models/customer';
import { Project } from 'src/app/models/project';
import { CustomerService } from 'src/app/services/customer-service/customer.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatSelectChange } from '@angular/material/select';
import { RateService } from 'src/app/services/rate-service/rate.service';
import { Rate } from '../../../../models/rate';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';
import { ProjectIdActivities } from 'src/app/models/projectId-activities';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Icons } from 'src/app/models/icons.enum';
@Component({
  selector: 'app-activity-page',
  templateUrl: './activity-page.component.html',
  styleUrls: ['./activity-page.component.sass'],
})
export class ActivityPageComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  icons = Icons;
  user?: User;
  activitiesOfTheDay: Activity[] = [];
  daySelected?: string;
  selectedDate?: Date;
  totalTimeBooked?: string;

  allCustomers?: Customer[];
  allProjects?: Project[];

  activitiesToDisplay?: Activity[];
  selectedFilterProjectId?: string;

  currentEmployeeCommitment?: number;

  timeBookedContainerColor?: string;

  projectsIdsOfCurrentDayActivities?: string[];

  projectsOfCurrentDayAndActivities?: ProjectIdActivities[] = [];
  currentEmployeeRates?: Rate[];

  activitiesWithNoProject?: Activity[];

  @Input() startDate?: Date;

  constructor(
    @Inject(ActivatedRoute)
    private activeRoute: ActivatedRoute,
    private userService: UserLoginService,
    private activityService: ActivityService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private customerService: CustomerService,
    private projectService: ProjectService,
    private rateService: RateService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.groupActivitiesWithNoProject();
    this.getCustomers();
    this.getProjects();
    const userId = this.activeRoute.snapshot.paramMap.get('id');

    if (userId) {
      this.getCurrentEmployeeCommitment(userId);
      this.userService
        .getUser(userId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result: User) => {
          const presetDate =
            this.activeRoute.snapshot.queryParamMap.get('presetDate');
          this.user = result;
          if (!presetDate) this.selectedDate = new Date();
          else {
            this.selectedDate = new Date(presetDate);
          }
          this.dateChanges();
        });
    }
  }

  groupActivitiesWithNoProject() {
    const allActivities = this.activitiesOfTheDay;
    const noProjectActivities: Activity[] = [];
    allActivities.forEach((activity) => {
      if (activity.projectId === null) {
        noProjectActivities.push(activity);
      }
    });
    this.activitiesWithNoProject = noProjectActivities;
  }

  getIdsOfProjectsOfTodayActivities() {
    const notUniqueProjectIds: string[] = [];
    this.activitiesOfTheDay.forEach((activity) => {
      if (activity.projectId) notUniqueProjectIds.push(activity.projectId);
    });
    const uniqueProjectIds = [...new Set(notUniqueProjectIds)];
    this.projectsIdsOfCurrentDayActivities = uniqueProjectIds;
  }

  sortActivitiesOnEachIndividualProject() {
    this.projectsOfCurrentDayAndActivities?.forEach((project) => {
      project.activitiesWithProjectId = this.sortActivitiesByStart(
        project.activitiesWithProjectId
      );
    });
  }

  deleteAllActivitiesOfUserDay() {
    if (this.activitiesOfTheDay.length) {
      const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
        panelClass: 'delete-confirmation-dialog',
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          if (this.user?.id && this.selectedDate)
            this.activityService
              .deleteAllActivitiesOfUserDay(
                this.user?.id,
                this.selectedDate?.toISOString().split('T')[0]
              )
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(() => {
                this.activitiesOfTheDay = [];
                this.getTotalTimeBookedToday();
                this.getIdsOfProjectsOfTodayActivities();
                this.projectsOfCurrentDayAndActivities = [];
                this.groupActivitiesOnProjectsUsingProjecIdActivitiesModel();
                this.sortActivitiesOnEachIndividualProject();
              });
        }
      });
    }
  }

  groupActivitiesOnProjectsUsingProjecIdActivitiesModel() {
    this.groupActivitiesWithNoProject();
    if (this.projectsIdsOfCurrentDayActivities) {
      this.projectsIdsOfCurrentDayActivities.forEach((projectId) => {
        const activitiesOfCurrentProject = this.activitiesOfTheDay.filter(
          (activity) => activity.projectId === projectId
        );
        if (activitiesOfCurrentProject) {
          this.projectsOfCurrentDayAndActivities?.push(<ProjectIdActivities>{
            projectId: projectId,
            activitiesWithProjectId: activitiesOfCurrentProject,
          });
        }
      });
    }
  }

  computeTimeBookedCardColor(hours: string) {
    if (
      this.selectedDate?.getDay() === 0 ||
      this.selectedDate?.getDay() === 6
    ) {
      this.timeBookedContainerColor = 'green';
      return;
    } else {
      if (parseInt(hours) === 0) {
        this.timeBookedContainerColor = 'red';
        return;
      }
      if (parseInt(hours) < this.currentEmployeeCommitment!) {
        this.timeBookedContainerColor = 'orange';
        return;
      }

      if (parseInt(hours) >= this.currentEmployeeCommitment!) {
        this.timeBookedContainerColor = 'green';
        return;
      }
    }
  }

  getCurrentEmployeeCommitment(employeeId: string) {
    this.rateService
      .getRateForEmployeeId(employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: Rate[]) => {
        this.currentEmployeeRates = result;
        this.computeCurrentEmployeTotalCommitment();
      });
  }

  computeCurrentEmployeTotalCommitment() {
    let totalCommitment = 0;
    this.currentEmployeeRates?.forEach((rate) => {
      totalCommitment = totalCommitment + rate.employeeTimeCommitement!;
    });
    this.currentEmployeeCommitment = totalCommitment;
  }

  setValueOfSelectedProject(event: MatSelectChange) {
    this.selectedFilterProjectId = event.value;
    this.projectsOfCurrentDayAndActivities = [];
    this.groupActivitiesOnProjectsUsingProjecIdActivitiesModel();
    if (this.selectedFilterProjectId !== 'all') {
      this.projectsOfCurrentDayAndActivities =
        this.projectsOfCurrentDayAndActivities?.filter(
          (entity) => entity.projectId === this.selectedFilterProjectId
        );
    }
  }

  nextDayPage() {
    const nextDayDate = this.selectedDate?.setDate(
      this.selectedDate.getDate() + 1
    );
    this.selectedDate = new Date(nextDayDate!);
    this.dateChanges();
  }

  prevDayPage() {
    const prevDayDate = this.selectedDate?.setDate(
      this.selectedDate.getDate() - 1
    );
    this.selectedDate = new Date(prevDayDate!);
    this.dateChanges();
  }

  dateChanges() {
    const dateFormatted = this.datepipe.transform(
      this.selectedDate,
      'dd/MM/yyyy'
    );
    this.projectsOfCurrentDayAndActivities = [];
    if (dateFormatted) {
      this.daySelected = dateFormatted;
      if (this.user?.id)
        this.activityService
          .getActivitiesByDateEmployeeId(this.user.id, this.daySelected)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((response) => {
            this.getCustomers();
            this.activitiesOfTheDay = response;
          });
    }
  }

  deleteActivity(activityToDelete: Activity) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      panelClass: 'delete-confirmation-dialog',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (activityToDelete.id)
          this.activityService
            .deleteActivity(activityToDelete.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
              this.activitiesOfTheDay = this.activitiesOfTheDay.filter(
                (activity) => activity.id !== activityToDelete.id
              );
              this.getTotalTimeBookedToday();
              this.getIdsOfProjectsOfTodayActivities();
              this.projectsOfCurrentDayAndActivities = [];
              this.groupActivitiesOnProjectsUsingProjecIdActivitiesModel();
              this.sortActivitiesOnEachIndividualProject();
            });
      }
    });
  }

  getTotalTimeBookedToday() {
    if (this.activitiesOfTheDay) {
      let milisecondsTotalForToday = 0;
      this.activitiesOfTheDay.forEach((activity) => {
        const startDate = new Date();
        const endDate = new Date();
        const startHour = Number(activity.start?.split(':')[0]);
        const startMinute = Number(activity.start?.split(':')[1]);
        startDate.setHours(startHour);
        startDate.setMinutes(startMinute);
        startDate.setSeconds(0);
        const endHour = Number(activity.end?.split(':')[0]);
        const endMinute = Number(activity.end?.split(':')[1]);
        endDate.setHours(endHour);
        endDate.setMinutes(endMinute);
        endDate.setSeconds(0);
        const timeForCurrentActivityMillis =
          endDate.getTime() - startDate.getTime();
        milisecondsTotalForToday += timeForCurrentActivityMillis;
      });

      this.totalTimeBooked = this.formatMilisecondsToHoursMinutes(
        milisecondsTotalForToday
      );
    }
  }
  minutesToHours(minutes: number): number {
    return minutes / 60;
  }
  formatMilisecondsToHoursMinutes(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes - hours * 60;
    this.computeTimeBookedCardColor(
      (hours + this.minutesToHours(remainingMinutes)).toString()
    );
    return `${(hours + this.minutesToHours(remainingMinutes)).toString()}`;
  }

  getCustomers() {
    this.customerService.getCustomers().subscribe((result) => {
      this.allCustomers = result;
      this.getProjects();
    });
  }
  getProjects() {
    this.projectService
      .getProjectsUser(this.localStorageService.userId!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.allProjects = result;
        this.getIdsOfProjectsOfTodayActivities();
        this.getTotalTimeBookedToday();
        this.groupActivitiesOnProjectsUsingProjecIdActivitiesModel();
        this.sortActivitiesOnEachIndividualProject();
      });
  }

  addNewActivity() {
    const dateToSend = this.datepipe.transform(
      this.selectedDate?.toString(),
      'dd/MM/yyyy'
    );
    const dialogRef = this.dialog.open(ActivityDialogComponent, {
      data: <UserDateActivity>{
        employeeId: this.user?.id,
        date: dateToSend,
      },
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe((newActivity: Activity) => {
      if (newActivity) this.activitiesOfTheDay.push(newActivity);
      this.getTotalTimeBookedToday();
      this.getIdsOfProjectsOfTodayActivities();
      this.projectsOfCurrentDayAndActivities = [];
      this.groupActivitiesOnProjectsUsingProjecIdActivitiesModel();
      this.sortActivitiesOnEachIndividualProject();
    });
  }

  addActivityOnCertainProject(projectId: string) {
    const dateToSend = this.datepipe.transform(
      this.selectedDate?.toString(),
      'dd/MM/yyyy'
    );
    const dialogRef = this.dialog.open(ActivityDialogComponent, {
      data: <UserDateActivity>{
        employeeId: this.user?.id,
        date: dateToSend,
        projectId: projectId,
      },
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe((newActivity: Activity) => {
      if (newActivity) this.activitiesOfTheDay.push(newActivity);
      this.getTotalTimeBookedToday();
      this.getIdsOfProjectsOfTodayActivities();
      this.projectsOfCurrentDayAndActivities = [];
      this.groupActivitiesOnProjectsUsingProjecIdActivitiesModel();
      this.sortActivitiesOnEachIndividualProject();
    });
  }

  editActivity(activityToEdit: Activity) {
    const dateToSend = this.datepipe.transform(
      this.selectedDate?.toString(),
      'dd/MM/yyyy'
    );
    const dialogRef = this.dialog.open(ActivityDialogComponent, {
      data: <UserDateActivity>{
        employeeId: this.user?.id,
        date: dateToSend,
        activity: activityToEdit,
      },
      panelClass: 'full-width-dialog',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getTotalTimeBookedToday();
      this.getIdsOfProjectsOfTodayActivities();
      this.projectsOfCurrentDayAndActivities = [];
      this.groupActivitiesOnProjectsUsingProjecIdActivitiesModel();
      this.sortActivitiesOnEachIndividualProject();
    });
  }

  duplicateActivity(activity: Activity) {
    const dialogRef = this.dialog.open(DuplicateActivityDialogComponent, {
      data: activity,
      panelClass: 'delete-confirmation-dialog',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.dateChanges();
    });
  }

  sortActivitiesByStart(activities: Activity[]) {
    const sortedActivities = activities.sort(
      (activityA, activityB) =>
        this.getTimeInDateFormat(activityA.start!).getTime() -
        this.getTimeInDateFormat(activityB.start!).getTime()
    );
    return sortedActivities;
  }

  getTimeInDateFormat(hhmm: string) {
    return new Date(
      0,
      0,
      0,
      Number(hhmm.slice(0, 2)),
      Number(hhmm.slice(3, 5))
    );
  }
}
