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
import { ActivityService } from 'src/app/services/activity.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { MatSelectChange } from '@angular/material/select';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/project';
import { CalendarDay } from 'src/app/models/calendar-day';
import { RateService } from 'src/app/services/rate.service';
import { Rate } from 'src/app/models/rate';
import { EmployeeCommitmentCalendar } from 'src/app/models/employee-commitment-calendar';
import e from 'express';

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

  employeesTotalCommitment?: number;

  constructor(
    private activityService: ActivityService,
    private userService: UserService,
    private projectService: ProjectService,
    private rateService: RateService
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
        color: '#ff0000',
        timeBooked: 0,
        expectedTimeCommitment: this.employeesTotalCommitment,
        date: <Date>date,
        employeesCommitment: [],
      });
      this.calendarDays?.push(newCalendarDay);
    });
    this.computeTimeCommitmentOnCalendarDaysAllEmployees();
  }

  computeTimeCommitmentOnCalendarDaysAllEmployees() {
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
          if (hoursFromMinutes > 1) {
            employeeReportedHours = Math.round(hoursFromMinutes);
          }
          const newEmployeeCommitmentCalendar = <EmployeeCommitmentCalendar>(<
            unknown
          >{
            employee: employee.id,
            reportedHours: employeeReportedHours,
            employeeExpectedCommitment: this.getExpectedCommitmentOfEmployee(
              employee.id!
            ),
          });
          calendarDay.employeesCommitment.push(newEmployeeCommitmentCalendar);
        }
      });
    });
  }

  minutesToHours(minutes: number): number {
    return minutes / 60;
  }

  transformNewDateToDBString(date: Date): string {
    //this might help for day selections.
    // const nextDate = new Date();
    // nextDate.setDate(date.getDate() + 1);
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
    return employeeTotalExpectedCommitment;
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
      let totalCommitmentOfCalendarDay = 0;
      calendarDay.employeesCommitment.forEach((employeeCommitment) => {
        totalCommitmentOfCalendarDay =
          totalCommitmentOfCalendarDay + employeeCommitment.reportedHours;
      });
      calendarDay.timeBooked = totalCommitmentOfCalendarDay;
      if (totalCommitmentOfCalendarDay === 0) calendarDay.color = 'red';
      if (totalCommitmentOfCalendarDay >= calendarDay.expectedTimeCommitment)
        calendarDay.color = 'green';
      if (
        totalCommitmentOfCalendarDay > 0 &&
        totalCommitmentOfCalendarDay < calendarDay.expectedTimeCommitment
      )
        calendarDay.color = 'orange';
    });
  }

  dateChanges() {
    this.activitiesInRange = [];
    this.calendarDays = [];
    this.datesInSelectedRange = [];
    this.getAllActivitiesInRange(this.allActivities!);
    this.getDatesInRange();
    this.generateCalendarDaysForEachDateInSelectedRange();
    this.generateCalendarDayColors();
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
        if (result) this.getEmployeeRates();
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
      }
    });
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

  private stringToDate(dateString: string) {
    const splitDateString = dateString.split('/');
    const dateStringISO =
      splitDateString[2] + '-' + splitDateString[1] + '-' + splitDateString[0];
    return new Date(dateStringISO);
  }

  ngOnInit(): void {
    this.getAllActivities();
    this.getAllUsers();
    this.getAllProjects();
    this.getEmployeeRates();
    this.getDatesInRange();

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
