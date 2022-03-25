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
  search: String = '';

  getUsers() {
    this.allUsersSubscrption = this.userService
      .getUsers()
      .subscribe((result) => {
        this.allUsers = result;
      });
  }

  searchUsersWithName() {
    if (this.search !== '')
      this.allUsers = this.allUsers?.filter(
        (user) => user.surname === this.search
      );
  }

  deleteUser(userId: string) {
    this.allUsers = this.allUsers?.filter((user) => user.id !== userId);
    this.deleteUserSubscription = this.userService
      .deleteUser(userId)
      .subscribe();
  }

  editUser(user: User) {
    this.dialog.open(UserDialogComponent, {
      data: user,
    });
  }

  addUser() {
    this.dialog.open(UserDialogComponent);
  }

  checkSearch() {
    if (this.search == '') {
      this.allUsersSubscrption?.unsubscribe();
      this.getUsers();
    }
  }

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.allUsersSubscrption?.unsubscribe();
    this.deleteUserSubscription?.unsubscribe();
  }
}
