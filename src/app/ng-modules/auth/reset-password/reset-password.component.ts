import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserManagePasswordService } from 'src/app/services/user-manage-password-service/user-manage-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass'],
})
export class ResetPasswordComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  user!: User;
  userResetPasswordSub?: Subscription;
  resetPasswordForm?: FormGroup;

  constructor(private userManagePasswordService: UserManagePasswordService) {}
  sendPasswordResetRequest(email: string) {
    if (this.user) {
      this.user.email = email;
      this.user.password = '';
      this.userResetPasswordSub = this.userManagePasswordService
        .resetPasswordFor(this.user)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }

  get email() {
    return this.resetPasswordForm?.get('email');
  }

  ngOnInit(): void {
    this.user = <User>{};
    this.resetPasswordForm = new FormGroup({
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
      ]),
    });
  }
}
