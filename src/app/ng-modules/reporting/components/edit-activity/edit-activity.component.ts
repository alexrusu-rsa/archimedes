import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Activity } from '../../../../models/activity';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityService } from '../../../../services/activity.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.sass'],
})
export class EditActivityComponent implements OnInit, OnDestroy {
  currentActivity!: Activity;
  private getActivitySub?: Subscription;
  private updateActivitySub?: Subscription;
  editActivityForm?: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public activity: Activity,
    private activityService: ActivityService
  ) {}

  getCurrentActivity(id: string) {
    this.getActivitySub = this.activityService
      .getActivity(id)
      .subscribe((response: Activity) => {
        this.currentActivity = response;
        this.editActivityForm = new FormGroup({
          name: new FormControl(this.currentActivity.name, [
            Validators.required,
          ]),
          start: new FormControl(this.currentActivity.start, [
            Validators.required,
          ]),
          end: new FormControl(this.currentActivity.end, [Validators.required]),
        });
      });
  }

  updateActivity() {
    if (this.currentActivity) {
      this.updateActivitySub = this.activityService
        .updateActivity(this.currentActivity)
        .subscribe();
    }
  }

  ngOnInit(): void {
    this.getCurrentActivity(this.activity.id!);
  }
  ngOnDestroy(): void {
    this.getActivitySub?.unsubscribe();
    this.updateActivitySub?.unsubscribe();
  }
  get name() {
    return this.editActivityForm?.get('name');
  }

  get start() {
    return this.editActivityForm?.get('start');
  }

  get end() {
    return this.editActivityForm?.get('end');
  }
}
