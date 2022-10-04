import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Activity } from '../../../../models/activity';
import { User } from '../../../../models/user';
import { ActivityService } from '../../../../services/activity-service/activity.service';
import { UserLoginService } from '../../../../services/user-login.service';
import { ActivatedRoute } from '@angular/router';
import { ActivityDialogComponent } from '../activity-dialog/activity-dialog.component';
import { UserDateActivity } from 'src/app/models/userDataActivity';
import { DuplicateActivityDialogComponent } from '../duplicate-activity-dialog/duplicate-activity-dialog.component';
import { Customer } from 'src/app/models/customer';
import { Project } from 'src/app/models/project';
import { CustomerService } from 'src/app/services/customer-service/customer.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { throws } from 'assert';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatSelectChange } from '@angular/material/select';
import { RateService } from 'src/app/services/rate-service/rate.service';
import { Rate } from '../../../../models/rate';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import e from 'express';
import { createKeywordTypeNode } from 'typescript';
import { ProjectIdActivities } from 'src/app/models/projectId-activities';
@Component({
  selector: 'app-activity-page',
  templateUrl: './activity-page.component.html',
  styleUrls: ['./activity-page.component.sass'],
})
export class ActivityPageComponent implements OnInit, OnDestroy {
  user?: User;
  userSub?: Subscription;
  activitiesOfTheDaySub?: Subscription;
  deleteActivitySub?: Subscription;
  getUserSub?: Subscription;
  activitiesOfTheDay: Activity[] = [];
  daySelected?: string;
  selectedDate?: Date;
  totalTimeBooked?: string;

  allCustomers?: Customer[];
  allProjects?: Project[];

  allCustomersSub?: Subscription;
  allProjectsSub?: Subscription;

  activitiesToDisplay?: Activity[];
  selectedFilterProjectId?: string;

  currentEmployeeCommitment?: number;
  currentEmployeeCommitmentSub?: Subscription;

  timeBookedContainerColor?: string;
  subscriptions?: Subscription[];

  projectsIdsOfCurrentDayActivities?: string[];

  projectsOfCurrentDayAndActivities?: ProjectIdActivities[] = [];
  currentEmployeeRates?: Rate[];

  activitiesWithNoProject?: Activity[];

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
      this.getUserSub = this.userService
        .getUser(userId)
        .subscribe((result: User) => {
          this.user = result;
          this.selectedDate = new Date();
          this.dateChanges();
        });
      this.subscriptions?.push(this.getUserSub);
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

  computeTimeBookedCardColor(hours: string, minutes: string) {
    if (parseInt(hours) === 0 && parseInt(minutes) === 0) {
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

  getCurrentEmployeeCommitment(employeeId: string) {
    this.currentEmployeeCommitmentSub = this.rateService
      .getRateForEmployeeId(employeeId)
      .subscribe((result: Rate[]) => {
        this.currentEmployeeRates = result;
        this.computeCurrentEmployeTotalCommitment();
      });
    this.subscriptions?.push(this.currentEmployeeCommitmentSub);
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

  dateChanges() {
    const dateFormatted = this.datepipe.transform(
      this.selectedDate,
      'dd/MM/yyyy'
    );
    this.projectsOfCurrentDayAndActivities = [];
    if (dateFormatted) {
      this.daySelected = dateFormatted;
      if (this.user?.id)
        this.activitiesOfTheDaySub = this.activityService
          .getActivitiesByDateEmployeeId(this.user.id, this.daySelected)
          .subscribe((response) => {
            this.getCustomers();
            this.activitiesOfTheDay = response;
          });
      this.subscriptions?.push(this.activitiesOfTheDaySub!);
    }
  }

  deleteActivity(activityToDelete: Activity) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      panelClass: 'full-width-dialog',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (activityToDelete.id)
          this.deleteActivitySub = this.activityService
            .deleteActivity(activityToDelete.id)
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
        this.subscriptions?.push(this.deleteActivitySub!);
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

  formatMilisecondsToHoursMinutes(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes - hours * 60;
    this.computeTimeBookedCardColor(
      hours.toString(),
      remainingMinutes.toString()
    );
    return ` ${hours}.${remainingMinutes}`;
  }

  getCustomers() {
    this.allCustomersSub = this.customerService
      .getCustomers()
      .subscribe((result) => {
        this.allCustomers = result;
        this.getProjects();
      });
    this.subscriptions?.push(this.allCustomersSub);
  }
  getProjects() {
    this.allProjectsSub = this.projectService
      .getProjectsUser(this.localStorageService.userId!)
      .subscribe((result) => {
        this.allProjects = result;
        this.getIdsOfProjectsOfTodayActivities();
        this.getTotalTimeBookedToday();
        this.groupActivitiesOnProjectsUsingProjecIdActivitiesModel();
        this.sortActivitiesOnEachIndividualProject();
      });
    this.subscriptions?.push(this.allProjectsSub);
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
      panelClass: 'full-width-dialog',
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

  ngOnDestroy(): void {
    this.subscriptions?.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
