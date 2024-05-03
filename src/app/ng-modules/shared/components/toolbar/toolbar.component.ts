import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { Icons } from 'src/app/models/icons.enum';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-toolbar',
  styleUrls: ['./toolbar.component.sass'],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  readonly destroyRef = inject(DestroyRef);

  @Input()
  pageTitle: string;
  @Input()
  currentUser: User;

  @Output()
  toggleSidenav: EventEmitter<void> = new EventEmitter<void>();

  icons = Icons;
  constructor(public service: AuthService) {}
}
