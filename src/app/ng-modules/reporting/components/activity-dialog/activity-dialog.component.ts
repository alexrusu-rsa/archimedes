import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { UserDateActivity } from 'src/app/models/userDataActivity';
import { ActivityService } from 'src/app/services/activity.service';
import { DateFormatService } from 'src/app/services/date-format.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.sass'],
})
export class ActivityDialogComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    private dateFormatService: DateFormatService,
    private activityService: ActivityService,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public userDateActivity: UserDateActivity
  ) {}

  projectNameFormControl = new FormControl();

  currentActivity?: Activity;
  addActivityForm?: FormGroup;
  addCurrentActivitySub?: Subscription;
  updateEditActivitySub?: Subscription;
  projects?: Project[];
  getProjectsSub?: Subscription;
  projectOfActivitySub?: Subscription;
  projectOfSelectedActivity?: Project;
  selectedItem?: string;
  activityTypes?: [string, string][];
  activityTypesSub?: Subscription;
  filteredProjects?: Observable<Project[]>;
  findProjectIdSub?: Subscription;

  addActivity() {
    if (this.currentActivity && this.checkAbleToRequestAddActivity()) {
      this.addCurrentActivitySub = this.activityService
        .addActivity(this.currentActivity)
        .subscribe((newActivity: Activity) =>
          this.dialogRef.close(newActivity)
        );
    }
  }

  private filter(value: string): Project[] {
    const filterValue = value.toLowerCase();
    return this.projects!.filter((project) =>
      project.projectName.toLowerCase().includes(filterValue)
    );
  }

  getProjects() {
    this.getProjectsSub = this.projectService
      .getProjects()
      .subscribe((result) => {
        this.projects = result;
        this.filteredProjects = this.projectName?.valueChanges.pipe(
          startWith(''),
          map((value) => this.filter(value))
        );
      });
  }
  onSelectionChange(event: any) {
    const selectedProjectId = this.projects?.find(
      (project) => project.projectName === event.option.value
    );
    this.currentActivity!.projectId = selectedProjectId?.id;
  }

  findProjectNameWithId(projectId: string): string {
    const projectWithId = this.projects?.find(
      (project) => project.id === projectId
    );
    if (projectWithId) return projectWithId.projectName;
    return '';
  }
  getActivityTypes() {
    this.activityTypesSub = this.activityService
      .getAllActivityTypes()
      .subscribe((result) => {
        this.activityTypes = Object.entries(result);
      });
  }

  checkAbleToRequestAddActivity(): boolean {
    if (!this.checkEndStart()) return false;
    if (this.name?.pristine || this.end?.pristine || this.start?.pristine)
      return false;
    return true;
  }

  checkAbleToRequestUpdateActivity(): boolean {
    if (!this.checkEndStart()) return false;
    if (
      this.name?.value !== '' &&
      this.end?.value !== '' &&
      this.start?.value !== ''
    )
      return true;
    return false;
  }

  editActivity() {
    if (this.currentActivity && this.checkAbleToRequestUpdateActivity()) {
      this.updateEditActivitySub = this.activityService
        .updateActivity(this.currentActivity)
        .subscribe((updatedActivity: Activity) => {
          this.dialogRef.close(updatedActivity);
        });
    }
  }

  checkEndStart(): boolean {
    const startDateWithTime = this.dateFormatService.getNewDateWithTime(
      this.start?.value
    );
    const endDateWithTime = this.dateFormatService.getNewDateWithTime(
      this.end?.value
    );
    if (endDateWithTime.getTime() < startDateWithTime.getTime()) return false;
    return true;
  }

  ngOnInit(): void {
    this.getProjects();
    this.getActivityTypes();
    this.currentActivity = <Activity>{};
    if (this.userDateActivity.activity !== undefined) {
      this.currentActivity = this.userDateActivity.activity;
      this.selectedItem = this.projectOfSelectedActivity?.projectName;
    } else {
      if (this.userDateActivity.date && this.userDateActivity.employeeId) {
        const activity: Activity = {
          date: this.userDateActivity.date,
          employeeId: this.userDateActivity.employeeId,
        };
        this.currentActivity = activity;
      }
    }
    this.addActivityForm = new FormGroup({
      name: new FormControl(this.currentActivity?.name, [Validators.required]),
      date: new FormControl(this.currentActivity?.date),
      start: new FormControl(this.currentActivity?.start, [
        Validators.required,
      ]),
      end: new FormControl(this.currentActivity?.end, [Validators.required]),
      projectName: new FormControl(this.currentActivity?.projectId),
      activityType: new FormControl(this.currentActivity?.activityType),
      description: new FormControl(this.currentActivity?.description),
      extras: new FormControl(this.currentActivity?.extras),
    });
  }

  get name() {
    return this.addActivityForm?.get('name');
  }
  get start() {
    return this.addActivityForm?.get('start');
  }
  get end() {
    return this.addActivityForm?.get('end');
  }
  get date() {
    return this.addActivityForm?.get('date');
  }
  get projectName() {
    return this.addActivityForm?.get('projectName');
  }

  ngOnDestroy(): void {
    this.addCurrentActivitySub?.unsubscribe();
    this.updateEditActivitySub?.unsubscribe();
    this.projectOfActivitySub?.unsubscribe();
    this.getProjectsSub?.unsubscribe();
    this.activityTypesSub?.unsubscribe();
  }
}
