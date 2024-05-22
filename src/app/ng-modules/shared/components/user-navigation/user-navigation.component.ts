import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-navigation',
  templateUrl: './user-navigation.component.html',
  styles: [
    `
      .opacity-70 
        opacity: 0.7
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNavigationComponent {
  @Input()
  user?: User;

  @Output()
  logOut = new EventEmitter<void>();
}
