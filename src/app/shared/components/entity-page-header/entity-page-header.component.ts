import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Icons } from '../../models/icons.enum';

@Component({
  selector: 'app-entity-page-header',
  templateUrl: './entity-page-header.component.html',
  imports: [CommonModule, MatFormField, MatLabel, MatButton, MatIcon, MatInput],
  standalone: true,
  styles: [
    `
    .top-button
      height: 58px
      cursor: pointer
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityPageHeaderComponent {
  protected readonly icons = Icons;
  label = input<string>();
  placeholder = input<string>();
  keyUp = output<Event>();
  addEntity = output<void>();
}
