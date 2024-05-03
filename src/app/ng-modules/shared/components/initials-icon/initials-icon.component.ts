import {
  ChangeDetectionStrategy,
  Component,
  Input,
  type OnInit,
} from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-initials-icon',
  templateUrl: './initials-icon.component.html',
  styleUrls: ['./initials-icon.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitialsIconComponent implements OnInit {
  @Input()
  user?: User;

  ngOnInit(): void {}
}
