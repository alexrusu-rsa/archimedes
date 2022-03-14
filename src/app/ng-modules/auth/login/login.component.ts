import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(
    private userLoginService: UserLoginService,
    private router: Router
  ) {}

  logUserIn(user: User) {
    this.logInSub = this.userLoginService.logUserIn(user).subscribe(
      (response: RequestWrapper) => {
        if (response.data === true) {
          const userId = response.userId;
          this.router.navigate(['reporting/dashboard/', userId]);
        }
      }
    );
  }

  ngOnInit(): void {
    this.user = <User>{};
  }
  ngOnDestroy(): void {
    this.logInSub?.unsubscribe();
  }
}
