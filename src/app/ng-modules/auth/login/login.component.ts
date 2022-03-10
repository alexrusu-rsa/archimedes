import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
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
    private router: Router
  ) {}

  logUserIn(user: User) {
    var logged = false;
    this.logInSub = this.userLoginService
      .logUserIn(user)
      .subscribe((response: RequestWrapper) => {
        logged = response.data;
        if (response.data === true) {
          const userId = response.userId;
          this.router.navigate(['reporting/dashboard/', userId]);
        }
      });
  }

  ngOnInit(): void {
    this.user = <User>{};
  }
  ngOnDestroy(): void {
    this.logInSub?.unsubscribe();
  }
}
