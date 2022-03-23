import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { ActivityService } from 'src/app/services/activity.service';
import { UserService } from 'src/app/services/user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.sass'],
})
export class ManagementPageComponent {
  constructor(
    private userService: UserService,
    private activityService: ActivityService,
    public dialog: MatDialog
  ) {}
  allUsers?: User[];
  allUsersSubscrption?: Subscription;
  deleteUserSubscription?: Subscription;

  getUsers() {
    this.allUsersSubscrption = this.userService
      .getUsers()
      .subscribe((result) => {
        this.allUsers = result;
        console.log(result);
      });
  }

  deleteUser(userId: string) {
    this.allUsers = this.allUsers?.filter((user) => user.id !== userId);
    this.deleteUserSubscription = this.userService
      .deleteUser(userId)
      .subscribe();
  }

  editUser(userId: string) {}

  addUser() {
    this.dialog.open(UserDialogComponent);
  }

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.allUsersSubscrption?.unsubscribe();
    this.deleteUserSubscription?.unsubscribe();
  }
}
