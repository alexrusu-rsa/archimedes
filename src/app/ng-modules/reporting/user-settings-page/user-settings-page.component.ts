import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { Icons } from 'src/app/models/icons.enum';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';
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
  hide = true;
  hideCheck = true;

  constructor(
    private userManagePasswordService: UserManagePasswordService,
    public localStorageService: LocalStorageService
  ) {}

  changePassword() {
    if (this.checkPasswordsMatch()) {
      this.passwordsDoNotMatch = false;
      this.userManagePasswordService
        .changePasswordFor(
          this.password?.value,
          this.localStorageService?.loginResponse?.currentUser?.id
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

  ngOnInit(): void {
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
