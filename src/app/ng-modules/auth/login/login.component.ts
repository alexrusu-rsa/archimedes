import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  heroForm?: FormGroup;

  constructor(
    private userLoginService: UserLoginService,
    private router: Router
  ) {}

  logUserIn(user: User) {
    this.logInSub = this.userLoginService
      .logUserIn(user)
      .subscribe((response: RequestWrapper) => {
        if (response.data === true) {
          const userId = response.userId;
          this.router.navigate(['reporting/dashboard/', userId]);
        }
      });
  }

  ngOnInit(): void {
    this.user = <User>{};
    this.heroForm = new FormGroup({
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(this.user.password, [Validators.required]),
    });
  }

  ngOnDestroy(): void {
    this.logInSub?.unsubscribe();
  }
}
