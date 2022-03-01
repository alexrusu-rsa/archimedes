import { Component, Inject, Input, OnInit } from '@angular/core';
import { Activity } from '../activity/activity';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityService } from '../services/activity.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.sass'],
})
export class EditActivityComponent implements OnInit {
  currentActivity?: Activity;
  private getActivitySub?: Subscription;
  private updateActivitySub?: Subscription;
  constructor(
    @Inject(MAT_DIALOG_DATA) public activity: Activity,
    private activityService: ActivityService,
  ) {}

  getCurrentActivity(id: string) {
    this.getActivitySub = this.activityService
      .getActivity(id)
      .subscribe((response: Activity) => (this.currentActivity = response));
  }

  updateActivity() {
    if (this.currentActivity) {
      this.updateActivitySub = this.activityService
        .updateActivity(this.currentActivity)
        .subscribe();
    }
  }

  ngOnInit(): void {
    this.getCurrentActivity(this.activity.id);
  }

  ngOnDestroy(): void {
    this.getActivitySub?.unsubscribe();
    this.updateActivitySub?.unsubscribe();
  }
}
