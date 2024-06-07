import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatMenu,
  MatMenuContent,
  MatMenuTrigger,
} from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { Icons } from 'src/app/models/icons.enum';
import { User } from 'src/app/models/user';
import { InitialsIconComponent } from 'src/app/shared/components/initials-icon/initials-icon.component';
import { UserNavigationComponent } from 'src/app/shared/components/user-navigation/user-navigation.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  standalone: true,
  imports: [
    CommonModule,
    InitialsIconComponent,
    UserNavigationComponent,
    MatIcon,
    MatIconButton,
    MatToolbar,
    MatMenu,
    MatMenuContent,
    MatMenuTrigger,
  ],
})
export class ToolbarComponent {
  pageTitle = input<string>();
  user = input<User>();

  toggleSidenav = output<void>();
  logOut = output<void>();

  protected icons = Icons;
}
