// import {
//   Component,
//   DestroyRef,
//   ElementRef,
//   OnInit,
//   QueryList,
//   ViewChildren,
//   inject,
// } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { Activity } from 'src/app/shared/models/activity';
// import { LocalStorageService } from 'src/app/shared/services/localstorage-service/localstorage.service';

// @Component({
//   selector: 'app-month-view',
//   templateUrl: './month-view.component.html',
// })
// export class MonthViewComponent implements OnInit {
//   selectedDate?: Date;
//   currentUserId?: string;
//   currentDate: Date = new Date();
//   activitiesOfSelectedMonthCurrentUser: Activity[] = [];
//   currentUserTimePerDay = 20;
//   dateTooltips: { [key: string]: string } = {};
//   datesWithActivities: ActivitiesOfDate[] = [];
//   subscriptionsArray: Subscription[] = [];
//   tooltipsIterator: string[] = [];
//   datesInCalendar: Date[] = [];

//   readonly destroyRef = inject(DestroyRef);
//   @ViewChildren('dateElement') dateElements?: QueryList<ElementRef>;
//   constructor(private localStorageService: LocalStorageService) {}
//   ngOnInit(): void {
//     this.currentUserId = this.localStorageService.userId;
//   }
// }

// interface ActivitiesOfDate {
//   date: string;
//   activities: Activity[];
//   reportedTime: number;
// }
