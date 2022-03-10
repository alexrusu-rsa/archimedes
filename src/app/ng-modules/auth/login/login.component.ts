import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
export class LoginComponent implements OnInit {
  user!: User;
  logInSub?: Subscription;

  constructor(
    private userLoginService: UserLoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  durationInSeconds = 5;
  logUserIn(user: User) {
    var logged = false;
    this.logInSub = this.userLoginService
      .logUserIn(user)
      .subscribe((response: RequestWrapper) => {
        logged = response.data;
        if (response.data === true) {
          const userId = response.userId;
          this.openSnackBar();
          this.router.navigate(['reporting/dashboard/', userId]);
        }
      });
  }

  openSnackBar() {
    this.snackBar.openFromComponent(LoginComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
  ngOnInit(): void {
    this.user = <User>{};
  }
  ngOnDestroy(): void {
    this.logInSub?.unsubscribe();
  }
}
