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
