import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.sass'],
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  constructor(private localStorageService: LocalStorageService) {}
  currentUserIdSub?: Subscription;
  currentUserId?: string;
  ngOnInit(): void {
    this.currentUserIdSub = this.localStorageService.userIdValue.subscribe(
      (result) => {
        if (result) this.currentUserId = result;
      }
    );
  }
  ngOnDestroy(): void {
    this.currentUserIdSub?.unsubscribe();
  }
}
