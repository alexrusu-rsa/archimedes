import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Activity } from '../../../../models/activity';
import { User } from '../../../../models/user';
import { ActivityService } from '../../../../services/activity.service';
import { UserLoginService } from '../../../../services/user-login.service';
import { ActivatedRoute } from '@angular/router';
import { ActivityDialogComponent } from '../activity-dialog/activity-dialog.component';
import { UserDateActivity } from 'src/app/models/userDataActivity';
import { DuplicateActivityDialogComponent } from '../duplicate-activity-dialog/duplicate-activity-dialog.component';

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

  constructor(
    @Inject(ActivatedRoute)
    private activeRoute: ActivatedRoute,
    private userService: UserLoginService,
    private activityService: ActivityService,
    public datepipe: DatePipe,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const userId = this.activeRoute.snapshot.paramMap.get('id');
    if (userId)
      this.getUserSub = this.userService
        .getUser(userId)
        .subscribe((result: User) => {
          this.user = result;
          this.selectedDate = new Date();
          this.dateChanges();
        });
  }

  dateChanges() {
    const dateFormatted = this.datepipe.transform(
      this.selectedDate,
      'dd/MM/yyyy'
    );
    if (dateFormatted) {
      this.daySelected = dateFormatted;
      if (this.user?.id)
        this.activitiesOfTheDaySub = this.activityService
          .getActivitiesByDateEmployeeId(this.user.id, this.daySelected)
          .subscribe((response) => {
            this.activitiesOfTheDay = response;
            this.getTotalTimeBookedToday();
          });
    }
  }

  deleteActivity(activityToDelete: Activity) {
    if (activityToDelete.id)
      this.deleteActivitySub = this.activityService
        .deleteActivity(activityToDelete.id)
        .subscribe((result) => {
          this.activitiesOfTheDay = this.activitiesOfTheDay.filter(
            (activity) => activity.id !== activityToDelete.id
          );
          this.getTotalTimeBookedToday();
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
    return ` ${hours}h ${remainingMinutes}min`;
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
    this.activitiesOfTheDaySub?.unsubscribe();
    this.deleteActivitySub?.unsubscribe();
    this.getUserSub?.unsubscribe();
  }
}
