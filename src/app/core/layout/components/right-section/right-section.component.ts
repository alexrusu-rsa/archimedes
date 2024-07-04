import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BookedTimeWidgetComponent } from 'src/app/shared/components/booked-time-widget/booked-time-widget.component';
import { UserWidgetComponent } from 'src/app/shared/components/user-widget/user-widget/user-widget.component';
import { User } from 'src/app/shared/models/user';
import { BookedTimePipe } from 'src/app/shared/pipes/booked-time.pipe';

@Component({
  selector: 'app-right-section',
  standalone: true,
  imports: [
    NgIf,
    BookedTimeWidgetComponent,
    BookedTimePipe,
    UserWidgetComponent,
  ],
  templateUrl: './right-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightSectionComponent {
  user = input<User>(null);
  activatedRoute = input<string>('');
  store = input(null);
  protected displayBookedTimeWidget = computed(
    () =>
      !!this.store().filter().date &&
      !!this.store().activities() &&
      !!this.user()?.timePerDay
  );
}
