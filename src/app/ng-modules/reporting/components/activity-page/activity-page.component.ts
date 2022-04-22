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
          .subscribe((response) => (this.activitiesOfTheDay = response));
    }
  }

  deleteActivity(activityToDelete: Activity) {
    if (activityToDelete.id)
      this.deleteActivitySub = this.activityService
        .deleteActivity(activityToDelete.id)
        .subscribe(
          () =>
            (this.activitiesOfTheDay = this.activitiesOfTheDay.filter(
              (activity) => activity.id !== activityToDelete.id
            ))
        );
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
    });
  }

  editActivity(activityToEdit: Activity) {
    const dateToSend = this.datepipe.transform(
      this.selectedDate?.toString(),
      'dd/MM/yyyy'
    );
    this.dialog.open(ActivityDialogComponent, {
      data: <UserDateActivity>{
        employeeId: this.user?.id,
        date: dateToSend,
        activity: activityToEdit,
      },
      panelClass: 'full-width-dialog',
    });
  }

  ngOnDestroy(): void {
    this.activitiesOfTheDaySub?.unsubscribe();
    this.deleteActivitySub?.unsubscribe();
    this.getUserSub?.unsubscribe();
  }
}
