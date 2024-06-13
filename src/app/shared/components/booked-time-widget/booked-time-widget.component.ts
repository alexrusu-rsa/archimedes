import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardFooter,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Icons } from '../../models/icons.enum';
import { RouterLink, RouterModule } from '@angular/router';
import { TimePipe } from '../../pipes/time.pipe';

@Component({
  selector: 'app-booked-time-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardFooter,
    MatProgressBar,
    MatButton,
    MatIcon,
    RouterLink,
    RouterModule,
    TimePipe,
  ],
  templateUrl: './booked-time-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookedTimeWidgetComponent {
  icons = Icons;
  bookedTime = input('');
  alocatedTime = input('');
  progress = computed(() => {
    if (this.bookedTime() === this.alocatedTime()) return 100;
    if (this.bookedTime() !== '0h') return 50;
    return 1;
  });
}
