import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-user-navigation',
  templateUrl: './user-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNavigationComponent {
  @Input()
  user?: User;

  constructor(public service: AuthService) {}
}
