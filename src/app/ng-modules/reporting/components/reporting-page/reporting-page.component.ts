import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';

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

  activitiesInRange?: Activity[];
  activitiesInRangeSub?: Subscription;

  allProjects?: Project[];
  allProjectsSub?: Subscription;

  noFilterUsers = 'ALLUSERS';
  nameFilter?: string;

  nameFilteredActivities?: Activity[];
  filterRange?: Date[] = [];

  constructor(
    private activityService: ActivityService,
    private userService: UserService,
    private projectService: ProjectService
  ) {}

  findEmployee(employeeId: string) {
    return this.allEmployees?.find((employee) => employee.id === employeeId);
  }

  findProject(projectId: string) {
    return this.allProjects?.find((project) => (project.id = projectId));
  }

  getAllUsers() {
    this.allEmployeesSub = this.userService
      .getUsers()
      .subscribe((result: User[]) => {
        this.allEmployees = result;
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
      });
  }

  ngOnInit(): void {
    this.getAllActivities();
    this.getAllUsers();
    this.getAllProjects();
    this.selectedItemEmployee = this.noFilterUsers;
    this.nameFilter = this.noFilterUsers;
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
  }

  ngOnDestroy(): void {
    this.activitiesInRangeSub?.unsubscribe();
    this.allActivitiesSub?.unsubscribe();
    this.allProjectsSub?.unsubscribe();
    this.allEmployeesSub?.unsubscribe();
  }

  get start() {
    return this.range?.get('start');
  }
  get end() {
    return this.range?.get('end');
  }
}
