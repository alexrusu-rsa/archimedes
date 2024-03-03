import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { Component, DestroyRef, inject } from '@angular/core';
import { IconEnum } from 'src/app/ng-modules/shared/icon.enum';
import { UserFacade } from '../../user.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { DeleteConfirmationDialogComponent } from 'src/app/ng-modules/reporting/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { NewUserDialogComponent } from 'src/app/ng-modules/reporting/components/new-user-dialog/new-user-dialog.component';
import { UserDialogComponent } from 'src/app/ng-modules/reporting/components/user-dialog/user-dialog.component';
import { filter, switchMap, take } from 'rxjs';

enum UserRoleEnum {
  admin = 'admin',
  user = 'user',
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.sass'],
})
export class UserManagementComponent {
  private destroyRef = inject(DestroyRef);
  userRole = UserRoleEnum;
  icon = IconEnum;

  constructor(
    public notificationService: NotificationService,
    public facade: UserFacade,
    public dialog: MatDialog
  ) {
    // do something
  }

  addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      panelClass: 'full-width-dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        switchMap((newUser: User) =>
          this.dialog
            .open(NewUserDialogComponent, { data: newUser.password })
            .afterClosed()
        )
      )
      .subscribe((_) => {
        this.facade.updateUsers();
      });
  }

  editUser(user: User) {
    this.dialog
      .open(UserDialogComponent, {
        data: user,
        panelClass: 'full-width-dialog',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((_) => {
        this.facade.updateUsers();
      });
  }

  deleteUser(userId: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      panelClass: 'full-width-dialog',
    });
    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter((dialogRefRespons) => !!dialogRefRespons),
        switchMap((_) =>
          this.facade
            .deleteUser(userId)
            .pipe(takeUntilDestroyed(this.destroyRef))
        )
      )
      .subscribe((_) => {
        this.facade.updateUsers();
        this.notificationService.openSuccesfulNotification(
          'user.management.userDeleted'
        );
      });
  }
}
