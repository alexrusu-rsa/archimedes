import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, take, timer } from 'rxjs';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { RequestWrapper } from '../../../models/request-wrapper';
import { User } from '../../../models/user';
import { UserLoginService } from '../../../services/user-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit, OnDestroy {
  user!: User;
  logInSub?: Subscription;
  loginForm?: FormGroup;
  logInProgress?: boolean;

  constructor(
    private userLoginService: UserLoginService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  async logUserIn(user: User) {
    this.logInProgress = true;
    this.logInSub = this.userLoginService
      .logUserIn(user)
      .subscribe((response: any) => {
        this.localStorageService.accessToken = response.access_token;
        this.localStorageService.role = response.role;
        this.localStorageService.userId = response.userId;
        const userId = response.userId;
        if (response.userId === null) this.logInProgress = false;
        this.router.navigate(['reporting/dashboard/', userId]);
      });
    await timer(1500).pipe(take(1)).toPromise();
    this.logInProgress = false;
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

  ngOnDestroy(): void {
    this.logInSub?.unsubscribe();
  }
}
