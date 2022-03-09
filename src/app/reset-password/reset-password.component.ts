import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../models/user';
import { UserManagePasswordService } from '../services/user-manage-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  user!: User;
  userResetPasswordSub?: Subscription;
  constructor(private userManagePasswordService: UserManagePasswordService) {}
  sendPasswordResetRequest(email: string) {
    if (this.user) {
      this.user.email = email;
      this.user.password = '';
      this.userResetPasswordSub = this.userManagePasswordService
        .resetPasswordFor(this.user)
        .subscribe();
    }
  }

  ngOnInit(): void {
    this.user = <User>{};
  }
  ngOnDestroy(): void {
    this.userResetPasswordSub?.unsubscribe();
  }
}
