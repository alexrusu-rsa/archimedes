import { Component, OnInit } from '@angular/core';
import { Activity } from '../activity/activity';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.sass'],
})
export class ActivityDialogComponent implements OnInit {
  currentActivity!: Activity;
  constructor(private activityService: ActivityService) {}

  addActivity() {
    this.activityService.addActivity(this.currentActivity);
  }
  ngOnInit(): void {
    this.currentActivity = <Activity>{};
  }
}
