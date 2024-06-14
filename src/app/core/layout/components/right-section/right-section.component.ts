import { BookedTimeService } from './../../../../shared/services/booked-time.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { BookedTimeWidgetComponent } from 'src/app/shared/components/booked-time-widget/booked-time-widget.component';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-right-section',
  standalone: true,
  imports: [CommonModule, BookedTimeWidgetComponent],
  templateUrl: './right-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightSectionComponent {
  service = inject(BookedTimeService);
  user = input<User>(null);
  activatedRoute = input<string>('');
  protected displayBookedTimeWidget = computed(
    () =>
      this.activatedRoute()?.includes('/activity') &&
      !!this.service.displayDate() &&
      !!this.service.bookedTime() &&
      !!this.user()?.timePerDay
  );
}
