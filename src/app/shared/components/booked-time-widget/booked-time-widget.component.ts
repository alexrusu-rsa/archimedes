import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardFooter,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatProgressBar,
  MatProgressBarModule,
} from '@angular/material/progress-bar';
import { Icons } from '../../models/icons.enum';
import { RouterLink, RouterModule } from '@angular/router';
import { TimePipe } from '../../pipes/time.pipe';
import { BookedPercentagePipe } from '../../pipes/booked-percentage.pipe';

@Component({
  selector: 'app-booked-time-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardFooter,
    MatProgressBarModule,
    MatButton,
    MatIcon,
    RouterLink,
    RouterModule,
    TimePipe,
    BookedPercentagePipe,
  ],
  templateUrl: './booked-time-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookedTimeWidgetComponent {
  icons = Icons;
  bookedTime = input('');
  alocatedTime = input('');
}
