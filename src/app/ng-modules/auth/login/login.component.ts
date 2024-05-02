import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';
import { User } from '../../../models/user';
import { UserLoginService } from '../../../services/user-login-service/user-login.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginResponse } from '../../shared/models/loginResponse.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  user: User;
  loginForm?: FormGroup;
  logInProgress?: boolean;

  constructor(
    private userLoginService: UserLoginService,
    private localStorageService: LocalStorageService
  ) {}

  logUserIn(user: User) {
    this.logInProgress = true;
    this.userLoginService
      .logUserIn(user)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: LoginResponse) => {
        if (response == undefined || response == null) {
          this.logInProgress = false;
          return;
        } else {
          this.localStorageService.loginResponse = response;
        }
      });
  }

  ngOnInit(): void {
    this.user = <User>{};
    this.logInProgress = false;
    this.loginForm = new FormGroup({
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(this.user.password, [Validators.required]),
    });
  }

  get email() {
    return this.loginForm?.get('email');
  }

  get password() {
    return this.loginForm?.get('password');
  }
}
