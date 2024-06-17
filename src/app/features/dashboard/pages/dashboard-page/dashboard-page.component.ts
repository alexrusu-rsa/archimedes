import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Signal,
  inject,
} from '@angular/core';
import { SalutationComponent } from '../../components/salutation/salutation.component';
import { LocalStorageService } from 'src/app/shared/services/localstorage-service/localstorage.service';
import { AuthService } from 'src/app/core/auth/services/auth-service/auth.service';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, SalutationComponent],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(AuthService);

  protected user: Signal<User> = toSignal(
    inject(LocalStorageService).userIdValue.pipe(
      switchMap((currentUserId) => {
        if (currentUserId) return this.service.getUser(currentUserId);
        else return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: null }
  );
}
