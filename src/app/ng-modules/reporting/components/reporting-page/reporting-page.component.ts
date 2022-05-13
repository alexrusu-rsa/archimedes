import { Component, OnInit } from '@angular/core';
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
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { MatSelectChange } from '@angular/material/select';

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
export class ReportingPageComponent implements OnInit {
  date = new FormControl(moment());

  selectedMonth?: string;
  selectedYear?: string;

  allActivities?: Activity[];
  allActivitiesSub?: Subscription;

  allEmployees?: User[];
  allEmployeesSub?: Subscription;

  selectedItemEmployee?: string;

  constructor(
    private activityService: ActivityService,
    private userService: UserService
  ) {}

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());

    if (normalizedMonthAndYear.month() < 10)
      this.selectedMonth = (normalizedMonthAndYear.month() + 1).toString();
    this.selectedYear = normalizedMonthAndYear.year().toString();
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  filterActivitiesEmployeeName(event: MatSelectChange) {
    this.allActivities = this.allActivities?.filter(
      (activity) => (activity.employeeId = event.value)
    );
  }

  getAllUsers() {
    this.allEmployeesSub = this.userService
      .getUsers()
      .subscribe((result: User[]) => {
        this.allEmployees = result;
      });
  }
  getAllActivities() {
    this.allActivitiesSub = this.activityService
      .getActivities()
      .subscribe((result: Activity[]) => {
        this.allActivities = result;
      });
  }
  ngOnInit(): void {
    this.getAllActivities();
    this.getAllUsers();
  }
}
