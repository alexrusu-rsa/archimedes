import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/localstorage-service/localstorage.service';
import { User } from '../../../../shared/models/user';
import { UserLoginService } from '../../services/user-login-service/user-login.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle,
} from '@angular/material/card';
import {
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatInput,
    MatFormField,
    MatLabel,
    MatHint,
    RouterLink,
    MatProgressBar,
    MatButton,
  ],
  styles: [
    `
    :host
      display: flex
      flex-direction: column
      justify-content: center
      height: 100%
    `,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly destroyRef = inject(DestroyRef);
  loginForm: FormGroup;
  logInProgress = false;

  constructor(
    private userLoginService: UserLoginService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  logUserIn() {
    this.logInProgress = true;

    const loginUser: User = {
      email: this.email?.value,
      password: this.password?.value,
    } as User;

    if (loginUser?.email && loginUser?.password)
      this.userLoginService
        .logUserIn(loginUser)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(({ currentUser, accessToken }) => {
          if (!(currentUser && accessToken)) this.logInProgress = false;
          this.localStorageService.accessToken = accessToken;
          this.localStorageService.role = currentUser.roles;
          this.localStorageService.userId = currentUser.id;
          this.router.navigate(['/dashboard']);
        });
    else {
      this.loginForm?.markAsDirty();
    }
  }

  get email() {
    return this.loginForm?.get('email');
  }

  get password() {
    return this.loginForm?.get('password');
  }
}
