import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, startWith, Subscription } from 'rxjs';
import { Project } from 'src/app/models/project';
import { Rate } from 'src/app/models/rate';
import { User } from 'src/app/models/user';
import { ProjectService } from 'src/app/services/project.service';
import { RateService } from 'src/app/services/rate.service';
import { UserManagePasswordService } from 'src/app/services/user-manage-password.service';
import { UserService } from 'src/app/services/user.service';
import { RateDialogComponent } from '../rate-dialog/rate-dialog.component';
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
  allRates: Rate[] = [];
  userResetPasswordSub?: Subscription;
  allRatesSub?: Subscription;
  deleteRateSub?: Subscription;
  projects?: Project[];

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
    this.getUsers();
    this.getRates();
    this.getProjects();
  }

  ngOnDestroy(): void {
    this.allUsersSubscrption?.unsubscribe();
    this.deleteUserSubscription?.unsubscribe();
    this.projectsSub?.unsubscribe();
  }

  findEmployeeNameWithId(employeeId: string): string {
    const employeeWithId = this.users?.find(
      (employee) => employee.id === employeeId
    );
    if (employeeWithId)
      return `${employeeWithId.name} ${employeeWithId.surname}`;
    return '';
  }

  getUsers() {
    this.allUsersSubscrption = this.userService
      .getUsers()
      .subscribe((result) => {
        this.allUsers = result;
        this.users = result;
      });
  }

  findProjectNameWithId(projectId: string): string {
    const projectWithId = this.projects?.find(
      (project) => project.id === projectId
    );
    if (projectWithId) return projectWithId.projectName;
    return '';
  }

  getProjects() {
    this.projectsSub = this.projectService.getProjects().subscribe((result) => {
      this.projects = result;
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

  getRates() {
    this.allRatesSub = this.rateService.getRates().subscribe((result) => {
      this.allRates = result;
    });
  }

  checkSearch() {
    if (this.search === '') {
      this.allUsersSubscrption?.unsubscribe();
      this.getUsers();
    }
  }

  addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe((newUser: User) => {
      if (newUser) this.allUsers.push(newUser);
    });
  }

  addRate() {
    const dialogRef = this.dialog.open(RateDialogComponent, {
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe((newRate: Rate) => {
      this.getRates();
    });
  }

  editRate(rate: Rate) {
    this.dialog.open(RateDialogComponent, {
      data: rate,
      panelClass: 'full-width-dialog',
    });
  }

  editUser(user: User) {
    this.dialog.open(UserDialogComponent, {
      data: user,
      panelClass: 'full-width-dialog',
    });
  }

  deleteRate(rate: Rate) {
    this.deleteRateSub = this.rateService
      .deleteRate(rate.id!)
      .subscribe((result) => {
        this.getRates();
      });
  }

  deleteUser(userId: string) {
    this.allUsers = this.allUsers?.filter((user) => user.id !== userId);
    this.deleteUserSubscription = this.userService
      .deleteUser(userId)
      .subscribe();
  }
}
