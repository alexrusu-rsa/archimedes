import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../custom/user';
import { UserLoginService } from '../services/user-login.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.sass'],
})
export class UserDashboardComponent implements OnInit {
  user?: User;
  userSub?: Subscription;
  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UserLoginService
  ) {}

  getUser(userId: string): void {
    this.userService
      .getUser(userId)
      .subscribe((result: User) => (this.user = result));
  }

  ngOnInit(): void {
    const userId = this.activeRoute.snapshot.paramMap.get('id');
    if (userId) this.getUser(userId);
  }
}
