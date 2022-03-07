import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActivityDialogComponent } from '../activity-dialog/activity-dialog.component';
import { Activity } from '../activity/activity';
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
  activitiesOfTheDay: Activity[] = [];
  daySelected?: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UserLoginService,
    private activityService: ActivityService,
    public datepipe: DatePipe,
    public dialog: MatDialog
  ) {}

  getUser(userId: string): void {
    this.userService
      .getUser(userId)
      .subscribe((result: User) => (this.user = result));
  }

  dateChanged(_$event: MatDatepickerInputEvent<any, any>) {
    const dateToFind = this.datepipe.transform(_$event.target.value);
    if (dateToFind) this.daySelected = dateToFind;
    if (dateToFind)
      if (this.user?.id)
        this.activitiesOfTheDaySub = this.activityService
          .getActivitiesByDateEmployeeId(this.user.id, dateToFind)
          .subscribe((response) => (this.activitiesOfTheDay = response));
  }

  deleteActivity(activityToDelete: Activity) {
    this.activitiesOfTheDay = this.activitiesOfTheDay.filter(
      (activity) => activity.id != activityToDelete.id
    );
    this.activityService.deleteActivity(activityToDelete.id!).subscribe();
  }

  editActivity(activity: Activity) {
    this.dialog.open(EditActivityComponent, {
      data: activity,
    });
  }

  addNewActivityForm() {
    this.dialog.open(ActivityDialogComponent, {
      data: this.user?.id,
    });
  }

  ngOnInit(): void {
    const userId = this.activeRoute.snapshot.paramMap.get('id');
    if (userId) this.getUser(userId);
  }
  ngOnDestroy(): void {
    this.activitiesOfTheDaySub?.unsubscribe();
  }
}
