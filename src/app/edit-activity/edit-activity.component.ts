import { Component, Inject, Input, OnInit } from '@angular/core';
import { Activity } from '../activity/activity';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityService } from '../services/activity.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.sass'],
})
export class EditActivityComponent implements OnInit {
  currentActivity?: Activity;
  constructor(
    @Inject(MAT_DIALOG_DATA) public activity: Activity,
    private activityService: ActivityService,
    private location: Location
  ) {}

  getCurrentActivity(id: number) {
    console.log(id);
    this.activityService
      .getActivity(id)
      .subscribe((response: Activity) => (this.currentActivity = response));
  }

  updateActivity() {
    if (this.currentActivity) {
      this.activityService
        .updateActivity(this.currentActivity)
        .subscribe();
    }
  }
  
  ngOnInit(): void {
    this.getCurrentActivity(this.activity.id);
  }
}
