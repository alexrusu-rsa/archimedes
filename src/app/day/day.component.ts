import { Component, OnInit } from '@angular/core';
import { catchError, Observable, of, Subscription } from 'rxjs';
import { Activity } from '../activity/activity';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.sass'],
})
export class DayComponent implements OnInit {
  constructor(private activityService: ActivityService) {}

  activities: Activity[] = [];
  activitiesSubscription?: Subscription;
  
  getActivities(): void {
    this.activitiesSubscription = this.activityService
      .getActivities()
      .subscribe((response) => (this.activities = response));
  }

  ngOnInit(): void {
    this.getActivities();
  }
  ngOnDestroy() {
    this.activitiesSubscription?.unsubscribe();
  }
}
