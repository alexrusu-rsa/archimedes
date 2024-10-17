import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { NavigationComponent } from 'src/app/shared/components/navigation/navigation.component';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-left-section',
  standalone: true,
  imports: [NavigationComponent, MatCard],
  templateUrl: './left-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftSectionComponent {
  user = input<User>(null);
}
