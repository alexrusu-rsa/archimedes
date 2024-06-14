import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ActivityStore } from 'src/app/features/activity/store/activity.store';
import { BookedTimeWidgetComponent } from 'src/app/shared/components/booked-time-widget/booked-time-widget.component';
import { User } from 'src/app/shared/models/user';
import { BookedTimePipe } from 'src/app/shared/pipes/booked-time.pipe';

@Component({
  selector: 'app-right-section',
  standalone: true,
  imports: [CommonModule, BookedTimeWidgetComponent, BookedTimePipe],
  templateUrl: './right-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightSectionComponent {
  store = inject(ActivityStore);
  user = input<User>(null);
  activatedRoute = input<string>('');
  protected displayBookedTimeWidget = computed(
    () =>
      this.activatedRoute()?.includes('/activity') &&
      !!this.store.filter().date &&
      !!this.store.activities() &&
      !!this.user()?.timePerDay
  );
}
