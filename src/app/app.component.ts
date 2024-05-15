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
  pageTitle?: string;
  hasToken = false;
  isAdmin = false;
  currentUserId?: string;
  activeToken?: string;
  icons = Icons;

  constructor(
    private router: Router,
    public authService: AuthService,
    private localStorageService: LocalStorageService,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'de', 'ro']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    if (browserLang?.match(/en|de|ro/)) translate.use(browserLang);
    else translate.use('en');
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
          const urlToFormat = event.url.substring(1, event.url.length);
          this.pageTitle = urlToFormat.split('/')[1];
        }
      });
  }
}
