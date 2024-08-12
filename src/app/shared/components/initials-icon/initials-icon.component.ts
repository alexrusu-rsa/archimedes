import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { User } from '../../models/user';
import { MatCardSubtitle } from '@angular/material/card';

@Component({
  selector: 'app-initials-icon',
  standalone: true,
  imports: [MatIcon, MatCardSubtitle],
  templateUrl: './initials-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    @use 'src/styles/variables.sass' as variables
  `,
})
export class InitialsIconComponent {
  user = input<User>(null);
}
