import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { UserLoginService } from 'src/app/services/user-login-service/user-login.service';
import { UserManagePasswordService } from 'src/app/services/user-manage-password-service/user-manage-password.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-user-settings-page',
  templateUrl: './user-settings-page.component.html',
  styleUrls: ['./user-settings-page.component.sass'],
})
export class UserSettingsPageComponent implements OnInit, OnDestroy {
  constructor(
    private userManagePasswordService: UserManagePasswordService,
    private localStorageService: LocalStorageService,
    private userService: UserLoginService
  ) {}

  resetPasswordForm?: FormGroup;
  passwordValue?: string;
  checkPasswordValue?: string;
  passwordsDoNotMatch?: boolean;
  changePasswordSub?: Subscription;
  findCurrentUserSub?: Subscription;
  currentUser?: User;
  hide = true;
  hideCheck = true;
  changePassword() {
    if (this.checkPasswordsMatch()) {
      this.passwordsDoNotMatch = false;
      this.changePasswordSub = this.userManagePasswordService
        .changePasswordFor(
          this.password?.value,
          this.localStorageService.userId!
        )
        .subscribe();
    } else {
      this.passwordsDoNotMatch = true;
    }
  }

  checkPasswordsMatch(): boolean {
    if (
      this.passwordValue &&
      this.checkPasswordValue &&
      this.checkPasswordValue !== '' &&
      this.passwordValue !== ''
    )
      return this.passwordValue === this.checkPasswordValue;
    return false;
  }

  getCurrentUser() {
    const currentUserId = this.localStorageService.userId;
    if (currentUserId)
      this.findCurrentUserSub = this.userService
        .getUser(currentUserId)
        .subscribe((result) => (this.currentUser = result));
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.passwordsDoNotMatch = false;
    this.resetPasswordForm = new FormGroup({
      password: new FormControl(this.passwordValue),
      checkPassword: new FormControl(this.checkPasswordValue),
    });
  }

  ngOnDestroy(): void {
    this.changePasswordSub?.unsubscribe();
  }

  get password() {
    return this.resetPasswordForm?.get('password');
  }

  get checkPassword() {
    return this.resetPasswordForm?.get('checkPassword');
  }
}
