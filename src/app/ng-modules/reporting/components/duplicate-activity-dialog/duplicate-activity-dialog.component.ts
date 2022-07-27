import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-duplicate-activity-dialog',
  templateUrl: './duplicate-activity-dialog.component.html',
  styleUrls: ['./duplicate-activity-dialog.component.sass'],
})
export class DuplicateActivityDialogComponent implements OnInit {
  constructor(
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<DuplicateActivityDialogComponent>,
    private activityService: ActivityService,
    @Inject(MAT_DIALOG_DATA) public activityToDuplicate: Activity
  ) {}

  currentActivity?: Activity;
  range?: FormGroup;
  addActivitiesInRangeSub?: Subscription;

  ngOnInit(): void {
    this.currentActivity = this.activityToDuplicate;

    const currentDate = new Date();
    const startDate = new Date();
    const endDate = new Date();
    this.range = new FormGroup({
      start: new FormControl(<Date>startDate),
      end: new FormControl(<Date>endDate),
    });
  }

  getDatesInRange() {
    if (this.currentActivity)
      this.addActivitiesInRangeSub = this.activityService
        .addDuplicates({
          activity: this.currentActivity,
          startDate: this.start?.value,
          endDate: this.end?.value,
        })
        .subscribe((result) => {
          this.dialogRef.close(result);
        });
  }

  addCurrentActivityToDatesInRange() {
    this.getDatesInRange();
  }

  duplicateActivitiesToSelectedRange() {
    this.addCurrentActivityToDatesInRange();
  }

  get start() {
    return this.range?.get('start');
  }
  get end() {
    return this.range?.get('end');
  }
}
