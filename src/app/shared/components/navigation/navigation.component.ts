import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatNavList,
    MatListItem,
    TranslateModule,
  ],
  styles: [
    `
  .active 
    background-color: #c45d17
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  isAdmin = input<boolean>(false);

  @Output()
  closeSidenav = new EventEmitter<void>();

  @Output()
  logOut = new EventEmitter<void>();
}
