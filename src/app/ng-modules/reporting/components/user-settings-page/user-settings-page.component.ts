import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { Icons } from 'src/app/models/icons.enum';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';
import { UserLoginService } from 'src/app/services/user-login-service/user-login.service';
import { UserManagePasswordService } from 'src/app/services/user-manage-password-service/user-manage-password.service';

@Component({
  selector: 'app-user-settings-page',
  templateUrl: './user-settings-page.component.html',
  styleUrls: ['./user-settings-page.component.sass'],
})
export class UserSettingsPageComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  icons = Icons;
  resetPasswordForm?: FormGroup;
  passwordValue?: string;
  checkPasswordValue?: string;
  passwordsDoNotMatch?: boolean;
  currentUser?: User;
  hide = true;
  hideCheck = true;

  constructor(
    private userManagePasswordService: UserManagePasswordService,
    private localStorageService: LocalStorageService,
    private userService: UserLoginService
  ) {}

  changePassword() {
    if (this.checkPasswordsMatch()) {
      this.passwordsDoNotMatch = false;
      this.userManagePasswordService
        .changePasswordFor(
          this.password?.value,
          this.localStorageService.userId!
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
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
      this.userService
        .getUser(currentUserId)
        .pipe(takeUntilDestroyed(this.destroyRef))
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

  get password() {
    return this.resetPasswordForm?.get('password');
  }

  get checkPassword() {
    return this.resetPasswordForm?.get('checkPassword');
  }
}
