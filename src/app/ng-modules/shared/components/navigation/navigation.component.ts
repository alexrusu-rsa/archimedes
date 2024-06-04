import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styles: [
    `
  .active 
    background-color: #c45d17
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  @Input()
  isAdmin?: boolean;

  @Input()
  currentUserId?: string;

  @Output()
  closeSidenav = new EventEmitter<void>();

  @Output()
  logOut = new EventEmitter<void>();
}
