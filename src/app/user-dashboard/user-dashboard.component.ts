import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActivityDialogComponent } from '../activity-dialog/activity-dialog.component';
import { Activity } from '../activity/activity';
import { DialogDataWrapper } from '../custom/dialog-data-wrapper';
import { User } from '../custom/user';
import { EditActivityComponent } from '../edit-activity/edit-activity.component';
import { ActivityService } from '../services/activity.service';
import { UserLoginService } from '../services/user-login.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.sass'],
})
export class UserDashboardComponent implements OnInit {
  user?: User;
  userSub?: Subscription;
  activitiesOfTheDaySub?: Subscription;
  deleteActivitySub?: Subscription;
  getUserSub?: Subscription;
  activitiesOfTheDay: Activity[] = [];
  daySelected?: string;
  selectedDate?: Date;

  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UserLoginService,
    private activityService: ActivityService,
    public datepipe: DatePipe,
    public dialog: MatDialog
  ) {}

  getUser(userId: string): void {
    this.getUserSub = this.userService
      .getUser(userId)
      .subscribe((result: User) => (this.user = result));
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
          .subscribe((response) => (this.activitiesOfTheDay = response));
    }
  }

  deleteActivity(activityToDelete: Activity) {
    this.activitiesOfTheDay = this.activitiesOfTheDay.filter(
      (activity) => activity.id !== activityToDelete.id
    );
    if (activityToDelete.id)
      this.deleteActivitySub = this.activityService
        .deleteActivity(activityToDelete.id)
        .subscribe();
  }

  editActivity(activity: Activity) {
    this.dialog.open(EditActivityComponent, {
      data: activity,
    });
  }

  addNewActivityForm() {
    const dateToSend = this.datepipe.transform(
      this.selectedDate?.toString(),
      'dd/MM/yyyy'
    );
    this.dialog.open(ActivityDialogComponent, {
      data: <DialogDataWrapper>{
        userId: this.user?.id,
        date: dateToSend,
      },
    });
  }

  ngOnInit(): void {
    const userId = this.activeRoute.snapshot.paramMap.get('id');
    if (userId) this.getUser(userId);
    this.selectedDate = new Date();
    this.dateChanges();
  }

  ngOnDestroy(): void {
    this.activitiesOfTheDaySub?.unsubscribe();
    this.deleteActivitySub?.unsubscribe();
    this.getUserSub?.unsubscribe();
  }
}
