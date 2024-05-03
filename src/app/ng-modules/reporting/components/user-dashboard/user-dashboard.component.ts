import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Icons } from 'src/app/models/icons.enum';
import { LoginResponse } from 'src/app/ng-modules/shared/models/loginResponse.model';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.sass'],
})
export class UserDashboardComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  icons = Icons;
  currentUserId?: string;

  constructor(private localStorageService: LocalStorageService) {}
  ngOnInit(): void {
    this.localStorageService.loginResponseValue$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((loginResponse) => loginResponse != null)
      )
      .subscribe((loginResponse: LoginResponse) => {
        this.currentUserId = loginResponse?.currentUser?.id;
      });
  }
}
