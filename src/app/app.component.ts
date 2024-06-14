import { Component, DestroyRef, OnInit, Signal, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/auth/services/auth-service/auth.service';
import { LocalStorageService } from './shared/services/localstorage-service/localstorage.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Icons } from './shared/models/icons.enum';
import { filter, map, of, switchMap } from 'rxjs';
import { User } from './shared/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  public readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly icons = Icons;

  protected user: Signal<User> = toSignal(
    inject(LocalStorageService).userIdValue.pipe(
      switchMap((currentUserId) => {
        if (currentUserId) return this.auth.getUser(currentUserId);
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
        return event.urlAfterRedirects;
      })
    )
  );

  ngOnInit() {
    this.translate.addLangs(['en', 'de', 'ro']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang?.match(/en|de|ro/)) this.translate.use(browserLang);
    else this.translate.use('en');
  }
}
