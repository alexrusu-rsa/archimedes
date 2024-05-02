import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-navigation',
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.sass'],
})
export class UserNavigationComponent {
  @Input()
  user: User;

  @Output()
  logOut: EventEmitter<void> = new EventEmitter<void>();
}
