import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}
  logOut() {
    this.authService.doLogout();
  }

  ngOnInit() {
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
    this.activeRoute = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.urlToFormat = event.url.substring(1, event.url.length);
        this.pageTitle = this.urlToFormat.split('/')[1];
      }
    });
  }
  ngOnDestroy() {
    this.accessSub?.unsubscribe();
    this.adminSub?.unsubscribe();
  }
}
