import { UserFacade } from './../../user.facade';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.sass'],
})
export class UserSettingsComponent implements OnInit {
  passwordFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    public facade: UserFacade,
    private notificationService: NotificationService
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
  }

  onSubmit() {
    if (this.passwordFormGroup.valid) {
      // Form is valid, handle submission
      this.facade
        .changePassword(this.passwordControl.value)
        .pipe(take(1))
        .subscribe(() => {
          this.notificationService.openSuccesfulNotification(
            'settings.successfullSubmit'
          );

          this.passwordFormGroup.reset({ emitEvent: false });
        });
    } else {
      // Form is invalid, mark fields as touched to display validation errors
      this.passwordFormGroup.markAllAsTouched();
    }
  }

  private passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const retypePassword = group.get('retypePassword')?.value;
    return password === retypePassword ? null : { passwordMismatch: true };
  }
}
