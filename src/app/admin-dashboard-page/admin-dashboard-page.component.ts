import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../services/localstorage-service/localstorage.service';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
  styleUrls: ['./admin-dashboard-page.component.sass'],
})
export class AdminDashboardPageComponent implements OnInit {
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
}
