import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';
import { ActivitiesOfDate } from 'src/app/models/activities-of-date';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.sass'],
})
export class MonthViewComponent implements OnInit {
  selectedDate?: Date;
  currentUserId?: string;
  currentDate: Date = new Date();
  activitiesOfSelectedMonthCurrentUser: Activity[] = [];
  currentUserTimePerDay = 20;
  dateTooltips: { [key: string]: string } = {};
  datesWithActivities: ActivitiesOfDate[] = [];
  subscriptionsArray: Subscription[] = [];
  tooltipsIterator: string[] = [];
  datesInCalendar: Date[] = [];

  readonly destroyRef = inject(DestroyRef);
  @ViewChildren('dateElement') dateElements?: QueryList<ElementRef>;
  constructor(private localStorageService: LocalStorageService) {}
  ngOnInit(): void {
    this.currentUserId = this.localStorageService.loginResponse.userId!;
  }
}
