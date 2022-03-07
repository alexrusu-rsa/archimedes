import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Activity } from '../activity/activity';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.sass'],
})
export class ActivityDialogComponent implements OnInit {
  currentActivity!: Activity;
  addNewActivitySub?: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public userId: string,
    private activityService: ActivityService
  ) {}

  addActivity() {
    this.currentActivity.employeeId = this.userId;
    this.addNewActivitySub = this.activityService
      .addActivity(this.currentActivity)
      .subscribe();
  }

  ngOnInit(): void {
    this.currentActivity = <Activity>{};
    this.currentActivity.employeeId = this.userId;
  }

  ngOnDestroy(): void {
    this.addNewActivitySub?.unsubscribe();
  }
}
