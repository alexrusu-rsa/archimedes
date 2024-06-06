import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Icons } from 'src/app/models/icons.enum';

@Component({
  selector: 'app-entity-page-header',
  templateUrl: './entity-page-header.component.html',
  styleUrls: ['./entity-page-header.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityPageHeaderComponent {
  icons = Icons;

  @Input()
  label?: string;

  @Input()
  placeholder?: string;

  @Output()
  keyUp = new EventEmitter<Event>();

  @Output()
  addEntity = new EventEmitter<void>();
}
