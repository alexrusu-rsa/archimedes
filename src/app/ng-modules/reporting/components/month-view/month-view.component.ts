import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, switchMap } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { ActivityType } from 'src/app/models/activity-type.enum';
import { ActivityService } from 'src/app/services/activity-service/activity.service';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { EventEmitter } from 'stream';
import { MonthViewDialogComponent } from '../month-view-dialog/month-view-dialog.component';
import { UserDate } from 'src/app/models/user-date';
import { ActivitiesOfDate } from 'src/app/models/activities-of-date';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.sass'],
})
export class MonthViewComponent implements OnInit, AfterViewInit {
  selectedDate?: Date;
  currentUserId?: string;
  currentDate: Date = new Date();
  activitiesOfSelectedMonthCurrentUser: Activity[] = [];
  currentUserTimePerDay?: number;
  dateTooltips: { [key: string]: string } = {};
  datesWithActivities: ActivitiesOfDate[] = [];
  subscriptionsArray: Subscription[] = [];
  tooltipsIterator: string[] = [];
  constructor(
    private activityService: ActivityService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  addTooltip(date: string, tooltip: string) {
    this.dateTooltips[date] = tooltip;
  }

  getTimeBookedOnDate(date: string): number {
    let hours = 0;
    let minutes = 0;
    const activitiesOfDate = this.activitiesOfSelectedMonthCurrentUser.filter(
      (activity) => activity.date.includes(date)
    );
    activitiesOfDate.forEach((activity) => {
      hours = hours + parseInt(activity.workedTime!.split(':')[0]);
      minutes = minutes + parseInt(activity.workedTime!.split(':')[1]);
    });
    const hoursFromMinutes = Math.trunc(minutes / 60);
    this.datesWithActivities.push({
      date: date,
      activities: activitiesOfDate,
      reportedTime: hours + hoursFromMinutes,
    } as ActivitiesOfDate);
    this.addTooltip(
      date,
      `On ${date} you reported ${hours + hoursFromMinutes}/${
        this.currentUserTimePerDay
      }`
    );
    return hours + hoursFromMinutes;
  }

  checkDate(date: Date): string {
    if (date.getDay() === 0 || date.getDay() === 6) return 'weekend-date';
    date.setDate(date.getDate() + 1);
    const splitDateISO = date.toISOString().split('T')[0];
    const yearMonthDay = splitDateISO.split('-');
    const dateToString = `${yearMonthDay[2]}/${yearMonthDay[1]}/${yearMonthDay[0]}`;
    const actualHours = this.getTimeBookedOnDate(dateToString);
    const cssClass = this.computeCssClassForDate(
      dateToString,
      this.currentUserTimePerDay!,
      actualHours
    );
    return cssClass;
  }

  computeCssClassForDate(
    date: string,
    expectedHours: number,
    actualHours: number
  ): string {
    let found = false;
    let cssClass = 'without-reported-hours';
    this.activitiesOfSelectedMonthCurrentUser.forEach((activity) => {
      if (activity.date.includes(date)) found = true;
    });
    if (found) cssClass = ' has-tooltip with-reported-hours';
    if (actualHours >= expectedHours)
      cssClass = 'has-tooltip fully-reported-hours';

    return cssClass + ' has-tooltip';
  }

  dateClass = (date: Date): string => {
    return this.checkDate(date);
  };

  onSelect(event: any) {
    this.selectedDate = event;
    if (event.getDay() === 0 || event.getDay() === 6) {
      return;
    } else {
      const splitDateISO = this.selectedDate!.toISOString().split('T')[0];
      const yearMonthDay = splitDateISO.split('-');
      const dateToString = `${yearMonthDay[2]}/${yearMonthDay[1]}/${yearMonthDay[0]}`;

      const activitiesOfDate = this.datesWithActivities.filter(
        (dateWithActivities) => dateWithActivities.date.includes(dateToString)
      );
      this.dialog.open(MonthViewDialogComponent, {
        data: {
          userId: this.currentUserId,
          date: this.selectedDate,
          activitiesOfDate: activitiesOfDate,
        } as unknown as UserDate,
        panelClass: 'full-width-dialog',
      });
    }
  }

  ngOnInit(): void {
    const userSub = this.localStorageService.userIdValue
      .pipe(
        switchMap((result) => {
          return this.activityService.getActivitiesOfMonthYearForUser(
            (this.currentDate.getMonth() + 1).toString(),
            this.currentDate.getFullYear().toString(),
            result!
          );
        })
      )
      .subscribe((activitiesOfSelectedMonth) => {
        this.activitiesOfSelectedMonthCurrentUser = activitiesOfSelectedMonth;
      });

    this.subscriptionsArray.push(userSub);

    const userIdSub = this.localStorageService.userIdValue
      .pipe(
        switchMap((result) => {
          this.currentUserId = result!;
          return this.userService.getUserTimePerDay(result!);
        })
      )
      .subscribe((userTimePerDay) => {
        this.currentUserTimePerDay = userTimePerDay;
      });

    this.subscriptionsArray.push(userIdSub);
  }

  ngAfterViewInit(): void {
    this.tooltipsIterator = Object.keys(this.dateTooltips);
  }
}
