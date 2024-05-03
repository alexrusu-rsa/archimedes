import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Icons } from 'src/app/models/icons.enum';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  @Input()
  currentUserId?: string;
  @Input()
  pageTitle?: string;
  @Output()
  toggleSidenav = new EventEmitter<void>();
  icons = Icons;
}
