import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { User } from '../../models/user';

@Component({
  selector: 'app-initials-icon',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './initials-icon.component.html',
  styleUrls: ['./initials-icon.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitialsIconComponent {
  user = input<User>(null);
}
