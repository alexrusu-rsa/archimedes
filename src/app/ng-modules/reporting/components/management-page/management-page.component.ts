import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { ActivityService } from 'src/app/services/activity.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.sass'],
})
export class ManagementPageComponent {
  constructor(
    private userService: UserService,
    private activityService: ActivityService
  ) {}
  allUsers?: User[];
  allUsersSubscrption?: Subscription;
  getUsers() {
    this.allUsersSubscrption = this.userService
      .getUsers()
      .subscribe((result) => {
        this.allUsers = result;
        console.log(result);
      });
  }
  ngOnInit(): void {
    this.getUsers();
  }
  ngOnDestroy(): void {
    this.allUsersSubscrption?.unsubscribe();
  }
}
