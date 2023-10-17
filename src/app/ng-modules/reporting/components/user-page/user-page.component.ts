import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, switchMap } from 'rxjs';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { UserManagePasswordService } from 'src/app/services/user-manage-password-service/user-manage-password.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { NewUserDialogComponent } from '../new-user-dialog/new-user-dialog.component';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.sass'],
})
export class UserPageComponent implements OnInit, OnDestroy {
  allUsers: User[] = [];
  deleteUserSubscription?: Subscription;
  users: User[] = [];
  search = '';
  userResetPasswordSub?: Subscription;
  projects?: Project[];
  fetchDataSubscription?: Subscription;

  test: string[] = ['ABC', 'def'];

  projectsSub?: Subscription;
  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private userManagePasswordService: UserManagePasswordService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.fetchDataSubscription?.unsubscribe();
    this.deleteUserSubscription?.unsubscribe();
  }

  fetchData() {
    this.fetchDataSubscription = this.userService
      .getUsers()
      .pipe(
        switchMap((users) => {
          this.allUsers = users;
          return this.projectService.getProjects();
        })
      )
      .subscribe((projects) => {
        this.projects = projects;
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

  sendPasswordResetRequest(user: User) {
    this.userResetPasswordSub = this.userManagePasswordService
      .resetPasswordFor(user)
      .subscribe();
  }

  checkSearch() {
    if (this.search === '') {
      this.fetchData();
    }
  }

  addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe((newUser: User) => {
      if (newUser) this.allUsers.push(newUser);
      this.dialog.open(NewUserDialogComponent, { data: newUser.password });
    });
  }

  editUser(user: User) {
    this.dialog.open(UserDialogComponent, {
      data: user,
      panelClass: 'full-width-dialog',
    });
  }

  deleteUser(userId: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      panelClass: 'full-width-dialog',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.allUsers = this.allUsers?.filter((user) => user.id !== userId);
        this.deleteUserSubscription = this.userService
          .deleteUser(userId)
          .subscribe();
      }
    });
  }
}
