import { Component } from '@angular/core';
import { Icons } from '../../../../shared/models/icons.enum';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
})
export class AdminDashboardPageComponent {
  protected readonly icons = Icons;
}
