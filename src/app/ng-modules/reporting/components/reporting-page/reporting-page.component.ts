import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import _moment, { Moment } from 'moment';
import { default as _rollupMoment } from 'moment';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity-service/activity.service';
import { first, last, Subscription, switchMap } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user-service/user.service';
import { MatSelectChange } from '@angular/material/select';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { Project } from 'src/app/models/project';
import { CalendarDay } from 'src/app/models/calendar-day';
import { RateService } from 'src/app/services/rate-service/rate.service';
import { Rate } from 'src/app/models/rate';
import { EmployeeCommitmentCalendar } from 'src/app/models/employee-commitment-calendar';
import e from 'express';
import { Calendar } from 'src/app/models/calendar';
import { WeekCalendarDay } from 'src/app/models/week-calendar-day';
import { MatDialog } from '@angular/material/dialog';
import { ReportingHoursBookedDialogComponent } from '../reporting-hours-booked-dialog/reporting-hours-booked-dialog.component';
import { EmployeeCommitmentDate } from 'src/app/models/employee-commitment-date';
import { TooltipPosition } from '@angular/material/tooltip';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-reporting-page',
  templateUrl: './reporting-page.component.html',
  styleUrls: ['./reporting-page.component.sass'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ReportingPageComponent implements OnInit, OnDestroy {
  date = new FormControl(moment());
  startDate?: Date;
  selectedMonth?: string;
  selectedYear?: string;

  allActivities?: Activity[];
  allActivitiesSub?: Subscription;

  allEmployees?: User[];
  allEmployeesSub?: Subscription;

  selectedItemEmployee?: string;
  range?: FormGroup;

  pickedStartDate?: string;
  pickedEndDate?: string;

  activitiesInRange: Activity[] = [];
  activitiesInRangeSub?: Subscription;

  allProjects?: Project[];
  allProjectsSub?: Subscription;

  allRates?: Rate[];
  allRatesSub?: Subscription;

  noFilterUsers = 'ALLUSERS';
  nameFilter?: string;

  nameFilteredActivities?: Activity[];
  filterRange: Date[] = [];

  calendarDays?: CalendarDay[] = [];
  datesInSelectedRange: Date[] = [];
  positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right',
  ];

  employeesTotalCommitment?: number;
  calendar?: Calendar = <Calendar>{
    numberOfWeeks: 0,
    weeksInCalendar: [],
  };

  firstDayOfCalendarInitial?: Date;
  lastDayOfCalendarInitial?: Date;

  constructor(
    private activityService: ActivityService,
    private userService: UserService,
    private projectService: ProjectService,
    private rateService: RateService,
    public dialog: MatDialog
  ) {}

  findEmployee(employeeId: string) {
    return this.allEmployees?.find((employee) => employee.id === employeeId);
  }

  findProject(projectId: string) {
    return this.allProjects?.find((project) => (project.id = projectId));
  }

  generateCalendarDaysForEachDateInSelectedRange() {
    this.datesInSelectedRange.forEach((date) => {
      const newCalendarDay = <CalendarDay>(<unknown>{
        color: 'red',
        timeBooked: 0,
        expectedTimeCommitment: this.employeesTotalCommitment,
        date: <Date>date,
        employeesCommitment: [],
        tooltipMessage: '',
      });
      this.calendarDays?.push(newCalendarDay);
    });
    this.computeTimeCommitmentOnCalendarDaysAllEmployees();
  }

  computeTimeCommitmentOnCalendarDaysAllEmployees() {
    if (this.calendarDays)
      this.calendarDays?.forEach((calendarDay) => {
        this.allEmployees?.forEach((employee) => {
          const filteredActivitiesOfEmployee = this.allActivities?.filter(
            (activity) => activity.employeeId === employee.id
          );
          if (filteredActivitiesOfEmployee) {
            let employeeReportedHours = 0;
            let employeeReportedMinutes = 0;
            filteredActivitiesOfEmployee?.forEach((activity) => {
              if (
                activity.date ===
                this.transformNewDateToDBString(calendarDay.date)
              ) {
                employeeReportedHours =
                  employeeReportedHours +
                  Number(activity.workedTime?.split(':')[0]);
                employeeReportedMinutes =
                  employeeReportedMinutes +
                  Number(activity.workedTime?.split(':')[1]);
              }
            });
            const hoursFromMinutes = this.minutesToHours(employeeReportedHours);
            employeeReportedHours =
              employeeReportedHours + Math.round(hoursFromMinutes);
            const newEmployeeCommitmentCalendar = <EmployeeCommitmentCalendar>(<
              unknown
            >{
              employee: employee.id,
              employeeName: employee.name + ' ' + employee.surname,
              reportedHours: employeeReportedHours,
              employeeExpectedCommitment: this.getExpectedCommitmentOfEmployee(
                employee.id!
              ),
            });
            if (newEmployeeCommitmentCalendar.employeeExpectedCommitment > 0)
              calendarDay.employeesCommitment.push(
                newEmployeeCommitmentCalendar
              );
          }
        });
      });
  }

  getTooltipText(calendarDay: CalendarDay): string {
    return calendarDay.tooltipMessage;
  }

  generateTooltipMessagesForCalendarDays() {
    this.calendarDays?.forEach((calendarDay) => {
      let newMessage = '';
      calendarDay.employeesCommitment.forEach((employeeCommitment) => {
        newMessage =
          newMessage +
          this.genereateEmployeeMessageForTooltip(employeeCommitment);
      });
      calendarDay.tooltipMessage = newMessage;
    });
  }

  genereateEmployeeMessageForTooltip(
    employeeCommitment: EmployeeCommitmentCalendar
  ): string {
    if (employeeCommitment.reportedHours === 0) {
      return employeeCommitment.employeeName + ' no reported hours' + '.\n';
    }
    if (
      employeeCommitment.reportedHours > 0 &&
      employeeCommitment.reportedHours <
        employeeCommitment.employeeExpectedCommitment
    )
      return (
        employeeCommitment.employeeName +
        ' - ' +
        employeeCommitment.reportedHours.toString() +
        '/' +
        employeeCommitment.employeeExpectedCommitment.toString() +
        '.\n'
      );

    if (
      employeeCommitment.reportedHours >=
      employeeCommitment.employeeExpectedCommitment
    )
      return (
        employeeCommitment.employeeName +
        ' - ' +
        employeeCommitment.reportedHours.toString() +
        '/' +
        employeeCommitment.employeeExpectedCommitment.toString() +
        '.\n'
      );
    return '';
  }

  minutesToHours(minutes: number): number {
    return minutes / 60;
  }

  transformNewDateToDBString(date: Date): string {
    const ISODate = date.toISOString().split('T')[0];
    return this.formatISOToDB(ISODate);
  }

  getExpectedCommitmentOfEmployee(employeeId: string): number {
    let employeeTotalExpectedCommitment = 0;
    this.allRates?.forEach((rate) => {
      if (rate.employeeId === employeeId) {
        employeeTotalExpectedCommitment =
          employeeTotalExpectedCommitment + rate.employeeTimeCommitement!;
      }
    });
    if (employeeTotalExpectedCommitment > 0)
      return employeeTotalExpectedCommitment;
    else return 0;
  }

  formatISOToDB(dateISO: string): string {
    const activityDate = dateISO.split('-');
    return activityDate[2] + '/' + activityDate[1] + '/' + activityDate[0];
  }

  transformDateToDBString(date: Date): string {
    return this.formatISOToDB(date.toISOString());
  }

  computeEmployeesTotalCommitment() {
    let totalCommitment = 0;
    this.allRates?.forEach((rate) => {
      totalCommitment = totalCommitment + rate.employeeTimeCommitement!;
    });
    this.employeesTotalCommitment = totalCommitment;
  }

  generateCalendarDayColors() {
    this.calendarDays?.forEach((calendarDay) => {
      let color = 'green';
      let totalCommitmentOfCalendarDay = 0;
      calendarDay.employeesCommitment.forEach((employeeCommitment) => {
        if (employeeCommitment.reportedHours === 0) color = 'red';
        if (
          employeeCommitment.reportedHours > 0 &&
          employeeCommitment.reportedHours <
            employeeCommitment.employeeExpectedCommitment
        )
          color = 'orange';
        totalCommitmentOfCalendarDay =
          totalCommitmentOfCalendarDay + employeeCommitment.reportedHours;
      });
      calendarDay.timeBooked = totalCommitmentOfCalendarDay;
      calendarDay.color = color;
    });
  }

  getNumberOfWeeksToDisplay(): number {
    const lastIndex = this.calendarDays!.length - 1;
    const numberOfDaysCheck = this.calendarDays!.length;
    let numberOfDays = this.calendarDays!.length;
    const firstDayNumber = this.getDayForMondayFirstDayOfWeek(
      this.calendarDays![0].date
    );
    const lastDayNumber = this.getDayForMondayFirstDayOfWeek(
      this.calendarDays![lastIndex].date
    );
    let numberOfWeeks = 0;
    let cursor = firstDayNumber;
    while (numberOfDays > 0) {
      if (cursor === 7) {
        numberOfWeeks = numberOfWeeks + 1;
        cursor = 0;
      }
      cursor = cursor + 1;
      numberOfDays = numberOfDays - 1;
    }
    if (cursor > 0) {
      numberOfWeeks = numberOfWeeks + 1;
    }
    if (firstDayNumber + 1 + numberOfDaysCheck - 1 <= 7) {
      numberOfWeeks = 1;
    }
    return numberOfWeeks;
  }

  addPaddingDaysToCalendarLastWeek() {
    const lastWeekIndex = this.calendar!.weeksInCalendar.length - 1;
    if (this.calendar!.weeksInCalendar[lastWeekIndex].weekDays!.length < 7) {
      const remainingDays =
        7 - this.calendar!.weeksInCalendar[lastWeekIndex].weekDays!.length;
      let cursor = 0;
      while (cursor < remainingDays) {
        this.calendar!.weeksInCalendar[lastWeekIndex].weekDays!.push(<
          CalendarDay
        >{
          color: '#d4d4d4',
          date: new Date(),
          employeesCommitment: {},
          expectedTimeCommitment: 0,
          timeBooked: 0,
          tooltipMessage: '',
          opacity: 0,
        });
        cursor = cursor + 1;
      }
    }
  }

  checkEmployeesCommitment(
    weekDay: CalendarDay,
    employeeCommitmentOfSelectedDay: EmployeeCommitmentCalendar[],
    todayDate: string
  ) {
    if (
      weekDay.color === 'red' ||
      weekDay.color === 'orange' ||
      weekDay.color === 'green'
    ) {
      const dialogRef = this.dialog.open(ReportingHoursBookedDialogComponent, {
        data: <EmployeeCommitmentDate>{
          employeeCommitment: employeeCommitmentOfSelectedDay,
          todayDate: todayDate,
        },

        panelClass: 'full-width-dialog',
      });
    }
  }

  addPaddingToCalendarFirstWeek() {
    if (this.calendar!.numberOfWeeks > 1) {
      if (this.calendar!.weeksInCalendar[0].weekDays!.length < 7) {
        const remainingDays =
          7 - this.calendar!.weeksInCalendar[0].weekDays!.length;
        let cursor = 0;
        while (cursor < remainingDays) {
          this.calendar!.weeksInCalendar[0].weekDays!.unshift(<CalendarDay>{
            color: '#d4d4d4',
            date: new Date(),
            employeesCommitment: {},
            expectedTimeCommitment: 0,
            timeBooked: 0,
            tooltipMessage: '',
            opacity: 0,
          });
          cursor = cursor + 1;
        }
      }
    } else {
      const firstDayOfOnlyWeek = this.getDayForMondayFirstDayOfWeek(
        this.calendar!.weeksInCalendar[0].weekDays![0].date
      );
      const lastDayOfOnlyWeekIndex =
        this.calendar!.weeksInCalendar[0].weekDays?.length;
      const lastDayOfOnlyWeek = this.getDayForMondayFirstDayOfWeek(
        this.calendar!.weeksInCalendar[0].weekDays![lastDayOfOnlyWeekIndex! - 1]
          .date
      );
      if (lastDayOfOnlyWeek! < 6)
        if (firstDayOfOnlyWeek! > 0) {
          const firstDayWeekIndex = firstDayOfOnlyWeek;
          const lastDayWeekIndex = lastDayOfOnlyWeek;
          let cursorUnshift = 0;
          const remainingDaysToAddInFront = firstDayWeekIndex!;
          while (cursorUnshift < remainingDaysToAddInFront) {
            this.calendar!.weeksInCalendar[0].weekDays!.unshift(<CalendarDay>{
              color: '#d4d4d4',
              date: new Date(),
              employeesCommitment: {},
              expectedTimeCommitment: 0,
              timeBooked: 0,
              tooltipMessage: '',
              opacity: 0,
            });
            cursorUnshift = cursorUnshift + 1;
          }

          const remainingDaysToAddAfterwards = 6 - lastDayWeekIndex!;
          let cursorPush = 0;
          while (cursorPush < remainingDaysToAddAfterwards) {
            this.calendar!.weeksInCalendar[0].weekDays!.push(<CalendarDay>{
              color: '#d4d4d4',
              date: new Date(),
              employeesCommitment: {},
              expectedTimeCommitment: 0,
              timeBooked: 0,
              tooltipMessage: '',
              opacity: 0,
            });
            cursorPush = cursorPush + 1;
          }
        } else {
          const lastDayWeekIndex = lastDayOfOnlyWeek;
          const remainingDaysToAddAfterwards = 6 - lastDayWeekIndex!;
          let cursorPush = 0;
          while (cursorPush < remainingDaysToAddAfterwards) {
            this.calendar!.weeksInCalendar[0].weekDays!.push(<CalendarDay>{
              color: '#d4d4d4',
              date: new Date(),
              employeesCommitment: {},
              expectedTimeCommitment: 0,
              timeBooked: 0,
              tooltipMessage: '',
              opacity: 0,
            });
            cursorPush = cursorPush + 1;
          }
        }
      else {
        let cursorUnshift = 0;
        const firstDayWeekIndex = firstDayOfOnlyWeek;
        const remainingDaysToAddInFront = firstDayWeekIndex! + 1;
        while (cursorUnshift < remainingDaysToAddInFront - 1) {
          this.calendar!.weeksInCalendar[0].weekDays!.unshift(<CalendarDay>{
            color: '#d4d4d4',
            date: new Date(),
            employeesCommitment: {},
            expectedTimeCommitment: 0,
            timeBooked: 0,
            tooltipMessage: '',
            opacity: 0,
          });
          cursorUnshift = cursorUnshift + 1;
        }
      }
    }
  }

  addDaysToWeeksInCalendar() {
    const newEmptyWeek = <WeekCalendarDay>{
      weekDays: [],
    };

    let calendarWeeks = this.calendar!.numberOfWeeks;
    const calendarDaysNumber = this.calendarDays!.length;

    const lastIndex = this.calendarDays!.length - 1;
    const firstDayNumber = this.getDayForMondayFirstDayOfWeek(
      this.calendarDays![0].date
    );
    const lastDayNumber = this.getDayForMondayFirstDayOfWeek(
      this.calendarDays![lastIndex].date
    );
    const newEmptyDay = <CalendarDay>{};
    while (calendarWeeks > 0) {
      this.calendar!.weeksInCalendar.push(newEmptyWeek);
      calendarWeeks = calendarWeeks - 1;
    }
    let weekCursor = 0;
    let cursor = 0;
    let weekDayCursor = firstDayNumber;
    let newWeek = <WeekCalendarDay>{
      weekDays: [],
    };

    while (cursor < calendarDaysNumber) {
      if (weekDayCursor === 7) {
        this.calendar!.weeksInCalendar[weekCursor] = newWeek;
        newWeek = {};
        newWeek = <WeekCalendarDay>{
          weekDays: [],
        };
        weekCursor = weekCursor + 1;
        weekDayCursor = 0;
      }
      newWeek.weekDays!.push(this.calendarDays![cursor]);
      weekDayCursor = weekDayCursor + 1;
      cursor = cursor + 1;
    }
    let checkAllDaysAdded = 0;
    this.calendar?.weeksInCalendar.forEach((week) => {
      checkAllDaysAdded = checkAllDaysAdded + week.weekDays!.length;
    });
    if (checkAllDaysAdded < calendarDaysNumber) {
      this.calendar!.weeksInCalendar[weekCursor] = newWeek;
    }
  }

  initialStateCalendar() {
    this.calendar!.weeksInCalendar = [];
    this.activitiesInRange = [];
    this.calendarDays = [];
    this.datesInSelectedRange = [];
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.firstDayOfCalendarInitial = firstDay;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.lastDayOfCalendarInitial = lastDay;
    this.getAllActivitiesInRangeParam(this.allActivities!, firstDay, lastDay);
    this.getDatesInRangeParam(
      this.firstDayOfCalendarInitial,
      this.lastDayOfCalendarInitial
    );
    this.generateCalendarDaysForEachDateInSelectedRange();
    this.generateCalendarDayColors();
    this.calendar!.numberOfWeeks = this.getNumberOfWeeksToDisplay();
    this.addDaysToWeeksInCalendar();
    this.addPaddingToCalendarFirstWeek();
    this.addPaddingDaysToCalendarLastWeek();
    this.generateTooltipMessagesForCalendarDays();
  }

  getDatesInRangeParam(firstDate: Date, lastDate: Date) {
    const date = new Date(firstDate);
    date.setDate(date.getDate());
    const dates = [];
    while (date <= lastDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    this.datesInSelectedRange = dates;
  }

  getDatesInRange() {
    const date = new Date(this.start?.value);
    date.setDate(date.getDate());
    const dates = [];
    while (date <= this.end?.value) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    this.datesInSelectedRange = dates;
  }

  getAllUsers() {
    this.allEmployeesSub = this.userService
      .getUsers()
      .subscribe((result: User[]) => {
        this.allEmployees = result;
        if (result) {
          this.getEmployeeRates();
        }
      });
  }

  getAllProjects() {
    this.allProjectsSub = this.projectService
      .getProjects()
      .subscribe((result) => {
        this.allProjects = result;
      });
  }

  getAllActivities() {
    this.allActivitiesSub = this.activityService
      .getActivities()
      .subscribe((result: Activity[]) => {
        this.allActivities = result;
        if (result) {
          this.getAllActivitiesInRange(result);
        }
      });
  }

  getEmployeeRates() {
    this.allRatesSub = this.rateService.getRates().subscribe((result) => {
      this.allRates = result;
      if (result) {
        this.computeEmployeesTotalCommitment();
        this.initialStateCalendar();
      }
    });
  }

  getAllActivitiesInRangeParam(
    activities: Activity[],
    firstDate: Date,
    lastDate: Date
  ) {
    if (activities !== undefined) {
      activities.forEach((activity) => {
        if (
          this.stringToDate(activity.date) >= this.start?.value &&
          this.stringToDate(activity.date) <= this.end?.value
        ) {
          this.activitiesInRange?.push(activity);
        }
      });
    }
  }

  getAllActivitiesInRange(activities: Activity[]) {
    if (activities !== undefined) {
      activities.forEach((activity) => {
        if (
          this.stringToDate(activity.date) >= this.start?.value &&
          this.stringToDate(activity.date) <= this.end?.value
        ) {
          this.activitiesInRange?.push(activity);
        }
      });
    }
  }

  getDayForMondayFirstDayOfWeek(date: Date): number {
    if (date.getDay() === 0) return 6;
    else return date.getDay() - 1;
  }
  private stringToDate(dateString: string) {
    const splitDateString = dateString.split('/');
    const dateStringISO =
      splitDateString[2] + '-' + splitDateString[1] + '-' + splitDateString[0];
    return new Date(dateStringISO);
  }

  dateChanges() {
    this.fetchDataOnDateChange();
  }

  fetchDataOnDateChange() {
    this.calendar!.weeksInCalendar = [];
    this.activitiesInRange = [];
    this.calendarDays = [];
    this.datesInSelectedRange = [];
    this.getAllActivitiesInRange(this.allActivities!);
    this.getDatesInRange();
    this.generateCalendarDaysForEachDateInSelectedRange();
    this.generateCalendarDayColors();
    this.calendar!.numberOfWeeks = this.getNumberOfWeeksToDisplay();
    this.addDaysToWeeksInCalendar();
    this.addPaddingToCalendarFirstWeek();
    this.addPaddingDaysToCalendarLastWeek();
    this.generateTooltipMessagesForCalendarDays();
  }

  fetchData() {
    this.calendar!.weeksInCalendar = [];
    this.activitiesInRange = [];
    this.calendarDays = [];
    this.datesInSelectedRange = [];
    this.activityService
      .getActivities()
      .pipe(
        switchMap((activities) => {
          this.allActivities = activities;
          this.getAllActivitiesInRange(this.allActivities);
          return this.userService.getUsers();
        }),
        switchMap((users) => {
          this.allEmployees = users;
          return this.rateService.getRates();
        }),
        switchMap((rates) => {
          this.allRates = rates;
          this.computeEmployeesTotalCommitment();
          this.initialStateCalendar();
          return this.projectService.getProjects();
        })
      )
      .subscribe((projects) => {
        this.allProjects = projects;
      });
  }
  ngOnInit(): void {
    this.fetchData();
    this.selectedItemEmployee = this.noFilterUsers;
    this.nameFilter = this.noFilterUsers;

    const currentDate = new Date();

    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    this.range = new FormGroup({
      start: new FormControl(<Date>startDate),
      end: new FormControl(<Date>endDate),
    });
  }

  ngOnDestroy(): void {
    this.activitiesInRangeSub?.unsubscribe();
    this.allActivitiesSub?.unsubscribe();
    this.allProjectsSub?.unsubscribe();
    this.allEmployeesSub?.unsubscribe();
    this.allRatesSub?.unsubscribe();
  }

  get start() {
    return this.range?.get('start');
  }
  get end() {
    return this.range?.get('end');
  }
}
