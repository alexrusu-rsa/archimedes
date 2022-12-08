import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, startWith, Subscription, switchMap } from 'rxjs';
import { Project } from 'src/app/models/project';
import { Rate } from 'src/app/models/rate';
import { User } from 'src/app/models/user';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { RateService } from 'src/app/services/rate-service/rate.service';
import { UserManagePasswordService } from 'src/app/services/user-manage-password-service/user-manage-password.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { NewUserDialogComponent } from '../new-user-dialog/new-user-dialog.component';
import { RateDialogComponent } from '../rate-dialog/rate-dialog.component';
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
  allRates: Rate[] = [];
  userResetPasswordSub?: Subscription;
  allRatesSub?: Subscription;
  deleteRateSub?: Subscription;
  projects?: Project[];
  fetchDataSubscription?: Subscription;

  test: string[] = ['ABC', 'def'];

  displayedColumns: string[] = [
    'projectId',
    'employeeId',
    'rate',
    'rateType',
    'employeeTimeCommitement',
    'editButton',
    'deleteButton',
  ];
  projectsSub?: Subscription;
  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private rateService: RateService,
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
        }),
        switchMap((projects) => {
          this.projects = projects;
          return this.rateService.getRates();
        })
      )
      .subscribe((rates) => {
        this.allRates = rates;
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
      .subscribe((result) => {});
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

  addRate() {
    const dialogRef = this.dialog.open(RateDialogComponent, {
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe((newRate: Rate) => {
      this.fetchData();
    });
  }

  editRate(rate: Rate) {
    const dialogRef = this.dialog.open(RateDialogComponent, {
      data: rate,
      panelClass: 'full-width-dialog',
    });
    dialogRef.afterClosed().subscribe((updatedRate: Rate) => {
      this.fetchData();
    });
  }

  editUser(user: User) {
    this.dialog.open(UserDialogComponent, {
      data: user,
      panelClass: 'full-width-dialog',
    });
  }

  deleteRate(rate: Rate) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      panelClass: 'delete-confirmation-dialog',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteRateSub = this.rateService
          .deleteRate(rate.id!)
          .subscribe((result) => {
            this.fetchData();
          });
      }
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
