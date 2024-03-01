import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.sass'],
})
export class UserSettingsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  currentUser$: Observable<User>;

  passwordFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {
    // do nothing
  }

  get passwordControl() {
    return this.passwordFormGroup.controls['password'];
  }

  get retypePasswordControl() {
    return this.passwordFormGroup.controls['retypePassword'];
  }

  ngOnInit(): void {
    // initialize form group
    this.passwordFormGroup = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        retypePassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

    const userId = this.localStorageService.userId;
    if (userId) this.currentUser$ = this.userService.getUser(userId);
  }

  onSubmit() {
    if (this.passwordFormGroup.valid) {
      // Form is valid, handle submission
      const userId = this.localStorageService.userId;
      if (userId) {
        this.userService
          .changePasswordFor(this.passwordControl.value, userId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.notificationService.openSuccesfulNotification(
              this.translateService.instant('settings.successfullSubmit')
            );

            this.passwordFormGroup.reset({ emitEvent: false });
          });
      }
    } else {
      // Form is invalid, mark fields as touched to display validation errors
      this.passwordFormGroup.markAllAsTouched();
    }
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const retypePassword = group.get('retypePassword')?.value;
    return password === retypePassword ? null : { passwordMismatch: true };
  }
}
