import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.sass'],
})
export class UserPageComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  allUsers: User[] = [];
  users: User[] = [];
  search = '';
  projects?: Project[];

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

  fetchData() {
    this.userService
      .getUsers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
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
    this.userManagePasswordService
      .resetPasswordFor(user)
      .pipe(takeUntilDestroyed(this.destroyRef))
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
        this.userService
          .deleteUser(userId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      }
    });
  }
}
