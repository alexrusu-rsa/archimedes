import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-first-user-page',
  templateUrl: './first-user-page.component.html',
  styleUrls: ['./first-user-page.component.sass'],
})
export class FirstUserPageComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  constructor(private router: Router, private userService: UserService) {}
  registerNewUserForm?: FormGroup;

  user!: User;
  checkPassword?: string;
  getUsersNumberSub?: Subscription;
  testPasswordsMatch?: boolean;

  ngOnInit(): void {
    this.userService
      .getUsersNumber()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result > 0) this.router.navigate(['auth/login']);
      });

    this.user = <User>{};
    this.registerNewUserForm = new FormGroup({
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(this.user.password, [Validators.required]),
      reEnteredPassword: new FormControl(this.checkPassword, [
        Validators.required,
      ]),
    });
  }

  registerUser() {
    const surname = 'editMe';
    const name = 'editMe';
    const role = 'editMe';
    const seniority = 'editMe';
    const userEmail = this.email?.value;
    const password = this.password?.value;
    const timePerDay = 'editMe';
    this.user.email = userEmail;
    this.user.surname = surname;
    this.user.name = name;
    this.user.role = role;
    this.user.seniority = seniority;
    this.user.timePerDay = timePerDay;
    this.user.password = password;
    this.testPasswordsMatch =
      this.password.toString() === this.checkPassword.toString();

    if (this.testPasswordsMatch) {
      this.userService
        .addAdmin(this.user)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }

  get email() {
    return this.registerNewUserForm?.get('email');
  }

  get password() {
    return this.registerNewUserForm?.get('password');
  }

  get reEnteredPassword() {
    return this.registerNewUserForm?.get('reEnteredPassword');
  }
}
