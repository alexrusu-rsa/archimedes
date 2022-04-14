import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.sass'],
})
export class UserPageComponent implements OnInit, OnDestroy {
  allUsers: User[] = [];
  allUsersSubscrption?: Subscription;
  deleteUserSubscription?: Subscription;
  users: User[] = [];
  search = '';

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.allUsersSubscrption?.unsubscribe();
    this.deleteUserSubscription?.unsubscribe();
  }

  getUsers() {
    this.allUsersSubscrption = this.userService
      .getUsers()
      .subscribe((result) => {
        this.allUsers = result;
        this.users = result;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allUsers = this.users?.filter((user: User) =>
      user.surname.toLowerCase().includes(filterValue.trim().toLowerCase())
    );
  }

  searchUsersWithName() {
    if (this.search !== '')
      this.allUsers = this.allUsers?.filter(
        (user) => user.surname === this.search
      );
  }

  checkSearch() {
    if (this.search === '') {
      this.allUsersSubscrption?.unsubscribe();
      this.getUsers();
    }
  }

  addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '33vw',
    });

    dialogRef.afterClosed().subscribe((newUser: User) => {
      if (newUser) this.allUsers?.push(newUser);
    });
  }

  editUser(user: User) {
    this.dialog.open(UserDialogComponent, {
      data: user,
    });
  }

  deleteUser(userId: string) {
    this.allUsers = this.allUsers?.filter((user) => user.id !== userId);
    this.deleteUserSubscription = this.userService
      .deleteUser(userId)
      .subscribe();
  }
}
