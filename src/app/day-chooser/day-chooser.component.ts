import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivityService } from '../services/activity.service';
import { Activity } from '../activity/activity';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivityDialogComponent } from '../activity-dialog/activity-dialog.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-day-chooser',
  templateUrl: './day-chooser.component.html',
  styleUrls: ['./day-chooser.component.sass'],
})
export class DayChooserComponent implements OnInit {
  date: Date = new Date();
  @Input()
  datePicker: any;
  activitiesOfTheDay: Activity[] = [];
  activitiesOfTheDaySub?: Subscription;

  constructor(
    public datepipe: DatePipe,
    private activityService: ActivityService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  dateChanged(_$event: any) {
    const dateToFind = this.datepipe.transform(_$event.target.value);
    if (dateToFind)
      this.activitiesOfTheDaySub = this.activityService
        .getActivitiesByDate(dateToFind)
        .subscribe((response) => (this.activitiesOfTheDay = response));
  }

  deleteActivity(activityToDelete: Activity) {
    this.activitiesOfTheDay = this.activitiesOfTheDay.filter(
      (act) => act !== activityToDelete
    );
    this.activityService.deleteActivity(activityToDelete.id).subscribe();
  }

  openDialog() {
    const dialogRef = this.dialog.open(ActivityDialogComponent);
  }

  editActivity(activity: Activity) {
    const dialogRef = this.dialog.open(ActivityDialogComponent);
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.activitiesOfTheDaySub?.unsubscribe();
  }
}
