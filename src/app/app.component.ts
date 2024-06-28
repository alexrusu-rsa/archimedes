import {
  Component,
  DestroyRef,
  OnInit,
  Renderer2,
  Signal,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/auth/services/auth-service/auth.service';
import { LocalStorageService } from './shared/services/localstorage-service/localstorage.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Icons } from './shared/models/icons.enum';
import { filter, map, of, switchMap } from 'rxjs';
import { User } from './shared/models/user';
import { ActivityStore } from './features/activity/store/activity.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  public readonly auth = inject(AuthService);
  protected readonly store = inject(ActivityStore);
  private readonly router = inject(Router);
  private renderer = inject(Renderer2);
  protected readonly localStorageService = inject(LocalStorageService);
  protected readonly icons = Icons;

  protected user: Signal<User> = toSignal(
    inject(LocalStorageService).userIdValue.pipe(
      switchMap((currentUserId) => {
        if (currentUserId) return this.auth.getUserMe();
        else return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: null }
  );
  protected pageTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
      map((event: NavigationStart) => {
        const path = event?.url?.substring(1, event?.url?.length);
        return path.includes('?') ? path.split('?')[0] : path;
      })
    )
  );
  protected activatedRoute = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        if (this.store.filter().date !== new Date())
          this.store.updateFilter({ project: null, date: new Date() });
        return event.urlAfterRedirects;
      })
    )
  );

  protected onThemeChanged() {
    this.localStorageService.updateDarkMode();
    if (this.localStorageService.darkMode()) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  ngOnInit() {
    this.translate.addLangs(['en', 'de', 'ro']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    if (browserLang?.match(/en|de|ro/)) this.translate.use(browserLang);
    else this.translate.use('en');

    if (this.localStorageService.darkMode()) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }
}
