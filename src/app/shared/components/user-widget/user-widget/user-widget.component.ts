import { Component, input } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-user-widget',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatChip,
    MatChipSet,
  ],
  templateUrl: './user-widget.component.html',
})
export class UserWidgetComponent {
  user = input<User>();
}
