import { Component, DestroyRef, OnInit, Signal, inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/auth/services/auth-service/auth.service';
import { LocalStorageService } from './shared/services/localstorage-service/localstorage.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Icons } from './shared/models/icons.enum';
import { of, switchMap } from 'rxjs';
import { UserLoginService } from './core/auth/services/user-login-service/user-login.service';
import { User } from './shared/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  pageTitle?: string;
  activeToken?: string;
  protected icons = Icons;
  user: Signal<User>;

  constructor(
    private router: Router,
    public authService: AuthService,
    private userService: UserLoginService,
    private localStorageService: LocalStorageService,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'de', 'ro']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    if (browserLang?.match(/en|de|ro/)) translate.use(browserLang);
    else translate.use('en');

    this.user = toSignal(
      this.localStorageService.userIdValue.pipe(
        switchMap((currentUserId) => {
          if (currentUserId) return this.userService.getUser(currentUserId);
          else return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      ),
      null
    );
  }

  ngOnInit() {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          const urlToFormat = event.url.substring(1, event.url.length);
          this.pageTitle = urlToFormat.split('/')[1];
        }
      });
  }
}
