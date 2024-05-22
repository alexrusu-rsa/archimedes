import { LocalStorageService } from './../../../../services/localstorage-service/localstorage.service';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { Icons } from 'src/app/models/icons.enum';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { UserLoginService } from 'src/app/services/user-login-service/user-login.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  @Input()
  pageTitle?: string;
  @Output()
  toggleSidenav = new EventEmitter<void>();
  icons = Icons;
  currentUser?: User | null;
  currentUserId?: string | null;

  constructor(
    private service: UserLoginService,
    public authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.localStorageService.userIdValue
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((currentUserId) => {
          this.currentUserId = currentUserId;
          if (currentUserId) return this.service.getUser(currentUserId);
          else return of(null);
        })
      )
      .subscribe((currentUser) => {
        this.currentUser = currentUser;
      });
  }
}
