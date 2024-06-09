import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserManagePasswordService } from 'src/app/services/user-manage-password-service/user-manage-password.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardActions,
    MatFormField,
    MatHint,
    MatLabel,
    MatInput,
    MatButton,
  ],
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
