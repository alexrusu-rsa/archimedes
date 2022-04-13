import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { User } from 'src/app/models/user';
import { ActivityService } from 'src/app/services/activity.service';
import { UserLoginService } from 'src/app/services/user-login.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.sass'],
})
export class UserDetailsComponent implements OnInit {
  currentUser?: User;
  currentUserActivities?: Activity[];
  currentUserActivitiesSub?: Subscription;
  currentUserSub?: Subscription;

  constructor(
    @Inject(ActivatedRoute)
    private activeRoute: ActivatedRoute,
    private usersService: UserLoginService,
    private activityService: ActivityService
  ) {}

  getEmployee(id: string) {
    this.currentUserSub = this.usersService.getUser(id).subscribe((result) => {
      this.currentUser = result;
    });
  }

  getActivitiesOfEmployee(id: string) {
    this.currentUserActivitiesSub = this.activityService
      .getActivitiesByEmployee(id)
      .subscribe((result) => {
        this.currentUserActivities = result;
      });
  }
  ngOnInit(): void {
    const userId = this.activeRoute.snapshot.paramMap.get('id');
    if (userId) {
      this.getEmployee(userId);
      this.getActivitiesOfEmployee(userId);
    }
  }
}
