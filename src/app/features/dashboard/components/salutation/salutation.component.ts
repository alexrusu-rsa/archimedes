import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  MatCard,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-salutation',
  standalone: true,
  imports: [
    TranslateModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
  ],
  templateUrl: './salutation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalutationComponent {
  user = input<User>();
}
