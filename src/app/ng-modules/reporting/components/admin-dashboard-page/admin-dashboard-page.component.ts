import { Component } from '@angular/core';
import { Icons } from '../../../../shared/models/icons.enum';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
  styleUrls: ['./admin-dashboard-page.component.sass'],
})
export class AdminDashboardPageComponent {
  public icons = Icons;
}
