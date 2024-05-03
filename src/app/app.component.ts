import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './services/localstorage-service/localstorage.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { User } from './models/user';
import { LoginResponse } from './ng-modules/shared/models/loginResponse.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  pageTitle: string;
  currentUser: User;

  constructor(
    private router: Router,
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
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          const urlToFormat = event.url
            .substring(1, event.url.length)
            .replace(/-/g, ' ');
          this.pageTitle = urlToFormat.split('/')[1];
        }
      });

    this.localStorageService.loginResponseValue$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loginResponse: LoginResponse) => {
        if (loginResponse?.currentUser) {
          this.currentUser = loginResponse?.currentUser;
        }
      });
  }
}
