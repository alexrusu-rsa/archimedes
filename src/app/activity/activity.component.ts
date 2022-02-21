import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActivityService } from '../services/activity.service';
import { Activity } from './activity';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.sass'],
})
export class ActivityComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activityService: ActivityService
  ) {}
  @Input() currentActivity?: Activity;
  routeSub?: Subscription

  getActivity(): void {
      this.routeSub = this.activityService
      .getActivity(5)
      .subscribe((response: Activity) => (this.currentActivity = response));

  }

  ngOnInit(): void {
    const activityId = this.route.snapshot.paramMap.get('id');
    console.log(activityId);
    this.getActivity();
  }

  ngOnDestroy():void{
    this.routeSub?.unsubscribe();
  }
}
