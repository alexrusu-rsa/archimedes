import {
  Component,
  DestroyRef,
  OnInit,
  Signal,
  computed,
  inject,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/auth/services/auth-service/auth.service';
import { LocalStorageService } from './shared/services/localstorage-service/localstorage.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Icons } from './shared/models/icons.enum';
import { filter, map, of, switchMap } from 'rxjs';
import { User } from './shared/models/user';
import { BookedTimeService } from './shared/services/booked-time.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  public readonly bookedTimeService = inject(BookedTimeService);
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
    null
  );
  protected pageTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
      map((event: NavigationStart) => {
        return event?.url?.substring(1, event?.url?.length);
      })
    )
  );
  private activatedRoute = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        return event.urlAfterRedirects;
      })
    )
  );
  protected displayBookedTimeWidget = computed(
    () =>
      this.activatedRoute()?.includes('/activity') &&
      !!this.bookedTimeService.displayDate() &&
      !!this.bookedTimeService.bookedTime() &&
      !!this.user()?.timePerDay
  );

  ngOnInit() {
    this.translate.addLangs(['en', 'de', 'ro']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang?.match(/en|de|ro/)) this.translate.use(browserLang);
    else this.translate.use('en');
  }
}
