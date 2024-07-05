import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { User } from '../../models/user';

@Component({
  selector: 'app-initials-icon',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './initials-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    @use 'src/styles/variables.sass' as variables

    .custom-icon
      color: variables.$user-navigation-header
  `,
})
export class InitialsIconComponent {
  user = input<User>(null);
}
