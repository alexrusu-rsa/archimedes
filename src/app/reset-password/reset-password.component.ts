import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../custom/user';
import { UserManagePasswordService } from '../services/user-manage-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass'],
})
export class ResetPasswordComponent implements OnInit {
  user!: User;
  userResetPasswordSub?: Subscription;
  constructor(private userManagePasswordService: UserManagePasswordService) {}
  sendPasswordResetRequest(email: string) {
    this.user.username = email;
    this.user.password = '';
    this.userResetPasswordSub = this.userManagePasswordService
      .resetPasswordFor(this.user)
      .subscribe();
  }

  ngOnInit(): void {
    this.user = <User>{};
  }
}
