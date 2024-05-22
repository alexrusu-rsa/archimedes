import { Component } from '@angular/core';
import { Icons } from 'src/app/models/icons.enum';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.sass'],
})
export class UserDashboardComponent {
  icons = Icons;
}
