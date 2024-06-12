import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-entity-item',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatChip,
    MatChipSet,
    MatIcon,
    MatIconButton,
    MatButton,
  ],
  templateUrl: './entity-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityItemComponent {
  title = input('');
  subtitle = input('');
  actions = input('');
  cardClass = input('');
  chips = input<string[]>([]);
}
