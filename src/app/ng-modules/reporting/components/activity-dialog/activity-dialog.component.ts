import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Activity } from '../../../../models/activity';
import { DialogDataWrapper } from '../../../../models/dialog-data-wrapper';
import { ActivityService } from '../../../../services/activity.service';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.sass'],
})
export class ActivityDialogComponent implements OnInit, OnDestroy {
  currentActivity!: Activity;
  addNewActivitySub?: Subscription;
  addActivityForm?: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public sentData: DialogDataWrapper,
    private activityService: ActivityService,
    @Inject(MAT_DIALOG_DATA) public activity: Activity
  ) {}

  addActivity() {
    if (this.currentActivity)
      this.currentActivity.employeeId = this.activity.employeeId;
    this.addNewActivitySub = this.activityService
      .addActivity(this.currentActivity)
      .subscribe();
  }

  ngOnInit(): void {
    this.currentActivity = <Activity>{};
    this.currentActivity.employeeId = this.sentData.userId;
    this.currentActivity.date = this.sentData.date;
    this.addActivityForm = new FormGroup({
      name: new FormControl(this.currentActivity.name, [Validators.required]),
      start: new FormControl(this.currentActivity.start, [Validators.required]),
      end: new FormControl(this.currentActivity.end, [Validators.required]),
      description: new FormControl(this.currentActivity.description),
      extras: new FormControl(this.currentActivity.extras),
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
  ngOnDestroy(): void {
    this.addNewActivitySub?.unsubscribe();
  }
}
