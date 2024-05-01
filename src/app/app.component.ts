import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth-service/auth.service';
import { LocalStorageService } from './services/localstorage-service/localstorage.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Icons } from './models/icons.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  title = 'archimedes-frontend';
  urlToFormat = '';
  pageTitle?: string;
  userRole?: string;
  hasToken?: boolean;
  isAdmin?: boolean;
  currentUserId?: string;
  activeToken?: string;
  icons = Icons;

  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'de', 'ro']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    if (browserLang?.match(/en|de|ro/)) translate.use(browserLang);
    else translate.use('en');
  }

  logOut() {
    this.authService.doLogout();
  }

  ngOnInit() {
    this.localStorageService.userIdValue
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue) this.currentUserId = nextValue;
      });
    this.localStorageService.accessTokenValue
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        this.hasToken = nextValue !== '' && nextValue !== null;
      });

    this.localStorageService.roleValue
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        this.isAdmin = nextValue === 'admin' && nextValue !== null;
      });

    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.urlToFormat = event.url.substring(1, event.url.length);
          this.pageTitle = this.urlToFormat.split('/')[1];
        }
      });
  }
  private tokenExpired(token: string) {
    if (token !== null) {
      const expiry = JSON.parse(atob(token.split('.')[1])).exp;
      return Math.floor(new Date().getTime() / 1000) >= expiry;
    }
    return false;
  }
}
