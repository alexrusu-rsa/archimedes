import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
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
    MatCardHeader,
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
  chips = input<string[] | string>();
  protected chipsIsArray = computed(() => Array.isArray(this.chips()));
  emptyIcon = input('');
  nestedCard = input(false);
}
