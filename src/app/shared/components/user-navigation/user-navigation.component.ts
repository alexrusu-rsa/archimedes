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
import { InitialsIconComponent } from 'src/app/shared/components/initials-icon/initials-icon.component';
import { User } from '../../models/user';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatCardSubtitle } from '@angular/material/card';

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
    MatSlideToggle,
    MatCardSubtitle,
  ],
  styles: [
    `
      @use 'src/styles/variables.sass' as variables
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNavigationComponent {
  user = input<User>();
  logOut = output<void>();

  darkMode = input<boolean>(false);
  darkModeChanged = output<boolean>();
}
