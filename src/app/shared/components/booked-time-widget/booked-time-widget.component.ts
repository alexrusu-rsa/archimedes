import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Icons } from '../../models/icons.enum';
import { RouterLink, RouterModule } from '@angular/router';
import { TimePipe } from '../../pipes/time.pipe';
import { BookedPercentagePipe } from '../../pipes/booked-percentage.pipe';
import { BookedMessagePipe } from '../../pipes/booked-message.pipe';
import { User } from '../../models/user';

@Component({
  selector: 'app-booked-time-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatProgressBarModule,
    MatButton,
    MatIcon,
    RouterLink,
    RouterModule,
    TimePipe,
    BookedPercentagePipe,
    BookedMessagePipe,
  ],
  templateUrl: './booked-time-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookedTimeWidgetComponent {
  icons = Icons;
  displayDate = input(new Date());
  bookedTime = input('');
  user = input<User>();
}
