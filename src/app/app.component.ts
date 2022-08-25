import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'archimedes-frontend';
  activeRoute?: Subscription;
  urlToFormat = '';
  pageTitle?: string;
  userRole?: string;
  hasToken?: boolean;
  isAdmin?: boolean;
  accessSub?: Subscription;
  adminSub?: Subscription;
  currentUserId?: string;
  userIdSub?: Subscription;
  activeToken?: string;
  activeTokenSub?: Subscription;

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
    this.userIdSub = this.localStorageService.userIdValue.subscribe(
      (nextValue) => {
        if (nextValue) this.currentUserId = nextValue;
      }
    );
    this.accessSub = this.localStorageService.accessTokenValue.subscribe(
      (nextValue) => {
        this.hasToken = nextValue !== '' && nextValue !== null;
      }
    );

    this.adminSub = this.localStorageService.roleValue.subscribe(
      (nextValue) => {
        this.isAdmin = nextValue === 'admin' && nextValue !== null;
      }
    );

    this.activeTokenSub = this.localStorageService.accessTokenValue.subscribe(
      (nextValue) => {
        if (!this.tokenExpired(nextValue!)) {
          if (this.isAdmin) {
            this.router.navigate(['reporting/admin-dashboard']);
          } else {
            this.router.navigate(['reporting/activity/' + this.currentUserId]);
          }
        } else {
          this.authService.doLogout();
        }
      }
    );

    this.activeRoute = this.router.events.subscribe((event) => {
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
  ngOnDestroy() {
    this.accessSub?.unsubscribe();
    this.adminSub?.unsubscribe();
    this.userIdSub?.unsubscribe();
    this.activeTokenSub?.unsubscribe();
  }
}
