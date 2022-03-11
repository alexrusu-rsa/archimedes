import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  constructor(private router: Router) {}

  ngOnInit() {
    this.activeRoute = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.urlToFormat = event.url.substring(1, event.url.length);
        this.pageTitle = this.urlToFormat.split('/')[1];
      }
    });
  }
}
