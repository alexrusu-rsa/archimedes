import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Activity } from '../activity/activity';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.sass'],
})
export class ActivityDialogComponent implements OnInit {
  currentActivity: Activity = {
    id: 0,
    name: '',
    date: ' ',
    start: '',
    end: '',
    description: '',
    extras: '',
    employeeId: 0,
  };
  constructor(private activityService: ActivityService) {}

  addActivity(
    activityName: string,
    activityDate: string,
    activityStart: string,
    activityEnd: string,
    activityDescription: string,
    activityExtras: string,
    activityEmployeeId: string
  ) {
    this.currentActivity.name = activityName;
    this.currentActivity.date = activityDate;
    this.currentActivity.start = activityStart;
    this.currentActivity.end = activityEnd;
    this.currentActivity.description = activityDescription;
    this.currentActivity.extras = activityExtras;
    this.currentActivity.employeeId = Number(activityEmployeeId);
    console.log(this.currentActivity);
    this.activityService.addActivity(this.currentActivity);
  }
  ngOnInit(): void {}
}
