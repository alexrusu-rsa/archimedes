import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.sass'],
})
export class UserDashboardComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  constructor(private localStorageService: LocalStorageService) {}
  currentUserId?: string;
  ngOnInit(): void {
    this.localStorageService.userIdValue
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) this.currentUserId = result;
      });
  }
}
