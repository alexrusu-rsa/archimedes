import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { UserDateActivity } from 'src/app/models/userDataActivity';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.sass'],
})
export class ActivityDialogComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    private activityService: ActivityService,
    @Inject(MAT_DIALOG_DATA) public userDateActivity: UserDateActivity
  ) {}

  currentActivity?: Activity;
  addActivityForm?: FormGroup;
  addCurrentActivitySub?: Subscription;
  updateEditActivitySub?: Subscription;

  addActivity() {
    if (this.currentActivity && this.checkAbleToRequestAddActivity()) {
      this.addCurrentActivitySub = this.activityService
        .addActivity(this.currentActivity)
        .subscribe();
      this.dialogRef.close();
    }
  }

  checkAbleToRequestAddActivity(): boolean {
    if (this.name?.pristine || this.end?.pristine || this.start?.pristine)
      return false;
    return true;
  }

  checkAbleToRequestUpdateActivity(): boolean {
    if (
      this.name?.value !== '' &&
      this.end?.value !== '' &&
      this.start?.value !== ''
    )
      return true;
    return false;
  }

  editActivity() {
    if (this.currentActivity && this.checkAbleToRequestUpdateActivity()) {
      this.updateEditActivitySub = this.activityService
        .updateActivity(this.currentActivity)
        .subscribe();
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {
    this.currentActivity = <Activity>{};
    if (this.userDateActivity.activity !== undefined) {
      this.currentActivity = this.userDateActivity.activity;
    } else {
      if (this.userDateActivity.date && this.userDateActivity.employeeId) {
        const activity: Activity = {
          date: this.userDateActivity.date,
          employeeId: this.userDateActivity.employeeId,
        };
        this.currentActivity = activity;
      }
    }
    this.addActivityForm = new FormGroup({
      name: new FormControl(this.currentActivity?.name, [Validators.required]),
      date: new FormControl(this.currentActivity?.date),
      start: new FormControl(this.currentActivity?.start, [
        Validators.required,
      ]),
      end: new FormControl(this.currentActivity?.end, [Validators.required]),
      description: new FormControl(this.currentActivity?.description),
      extras: new FormControl(this.currentActivity?.extras),
    });
  }

  get name() {
    return this.addActivityForm?.get('name');
  }
  get start() {
    return this.addActivityForm?.get('start');
  }
  get end() {
    return this.addActivityForm?.get('end');
  }
  get date() {
    return this.addActivityForm?.get('date');
  }

  ngOnDestroy(): void {
    this.addCurrentActivitySub?.unsubscribe();
    this.updateEditActivitySub?.unsubscribe();
  }
}
