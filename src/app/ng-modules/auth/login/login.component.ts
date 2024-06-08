import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';
import { User } from '../../../shared/models/user';
import { UserLoginService } from '../../../services/user-login-service/user-login.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  styles: [
    `
    :host
      display: flex
      flex-direction: column
      justify-content: center
      height: 100%
    `,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly destroyRef = inject(DestroyRef);
  loginForm: FormGroup;
  logInProgress = false;

  constructor(
    private userLoginService: UserLoginService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  logUserIn() {
    this.logInProgress = true;

    const loginUser: User = {
      email: this.email?.value,
      password: this.password?.value,
    } as User;

    if (loginUser?.email && loginUser?.password)
      this.userLoginService
        .logUserIn(loginUser)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(({ currentUser, accessToken }) => {
          if (!(currentUser && accessToken)) this.logInProgress = false;
          this.localStorageService.accessToken = accessToken;
          this.localStorageService.role = currentUser.roles;
          this.localStorageService.userId = currentUser.id;
          if (currentUser.roles === 'admin') {
            this.router.navigate(['reporting/admin-dashboard/']);
          } else {
            this.router.navigate(['reporting/dashboard/']);
          }
        });
    else {
      this.loginForm?.markAsDirty();
    }
  }

  get email() {
    return this.loginForm?.get('email');
  }

  get password() {
    return this.loginForm?.get('password');
  }
}
