import { Component } from '@angular/core';
import { LocalStorageService } from '../services/localstorage-service/localstorage.service';
import { Icons } from '../models/icons.enum';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
  styleUrls: ['./admin-dashboard-page.component.sass'],
})
export class AdminDashboardPageComponent {
  public icons = Icons;
  constructor(public localStorageService: LocalStorageService) {}
}
