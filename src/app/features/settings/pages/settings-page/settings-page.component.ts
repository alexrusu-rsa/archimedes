import { LocalStorageService } from '../../../../shared/services/localstorage-service/localstorage.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import {
  MatFormField,
  MatHint,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Icons } from 'src/app/shared/models/icons.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { UserManagePasswordService } from 'src/app/features/user/services/user-manage-password-service/user-manage-password.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatSuffix,
    MatFormField,
    MatInput,
    MatHint,
    MatLabel,
    MatButton,
  ],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  private destroyRef = inject(DestroyRef);
  private localStorage = inject(LocalStorageService);
  private service = inject(UserManagePasswordService);
  protected readonly icons = Icons;

  protected password = signal('');
  protected retypePassword = signal('');
  protected passwordMatches = computed(
    () => this.password() === this.retypePassword()
  );

  changePassword() {
    if (this.passwordMatches()) {
      this.service
        .changePasswordFor(this.password(), this.localStorage.userId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.password.set('');
          this.retypePassword.set('');
        });
    }
  }
}
