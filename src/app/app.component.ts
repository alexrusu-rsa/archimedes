import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'archimedes-frontend';
  activeRoute?: Subscription;
  urlToFormat = '';
  pageTitle?: string;
  userRole?: string;
  hasToken?: boolean;
  isAdmin?: boolean;

  constructor(private router: Router, private authService: AuthService) {}
  logOut() {
    this.authService.doLogout();
  }
  ngOnInit() {
    alert(environment.serviceURL);
    this.hasToken = false;
    window.addEventListener('storage', () => {
      this.hasToken = localStorage.getItem('access_token') !== null;
      this.isAdmin = localStorage.getItem('role') === 'admin';
    });
    this.activeRoute = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.urlToFormat = event.url.substring(1, event.url.length);
        this.pageTitle = this.urlToFormat.split('/')[1];
      }
    });
  }
}
