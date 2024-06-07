import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatMenuItem } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'src/app/models/user';
import { InitialsIconComponent } from 'src/app/shared/components/initials-icon/initials-icon.component';

@Component({
  selector: 'app-user-navigation',
  templateUrl: './user-navigation.component.html',
  standalone: true,
  imports: [
    MatDivider,
    InitialsIconComponent,
    TranslateModule,
    MatMenuItem,
    CommonModule,
    RouterLink,
  ],
  styles: [
    `
      .opacity-70 
        opacity: 0.7
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNavigationComponent {
  user = input<User>();
  logOut = output<void>();
}
