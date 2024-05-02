import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { Icons } from 'src/app/models/icons.enum';
import { Project } from 'src/app/models/project';
import { UserDateActivity } from 'src/app/models/userDataActivity';
import { ActivityService } from 'src/app/services/activity-service/activity.service';
import { DateFormatService } from 'src/app/services/date-format-service/date-format.service';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.sass'],
})
export class ActivityDialogComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  icons = Icons;

  constructor(
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    private dateFormatService: DateFormatService,
    private activityService: ActivityService,
    private projectService: ProjectService,
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public userDateActivity: UserDateActivity
  ) {}

  projectNameFormControl = new FormControl();

  currentActivity?: Activity;
  addActivityForm?: FormGroup;
  projects?: Project[];
  projectOfSelectedActivity?: Project;
  selectedItem?: string;
  activityTypes?: [string, string][];
  filteredProjects?: Observable<Project[]>;

  addActivity() {
    this.currentActivity!.name = this.name?.value;
    this.currentActivity!.activityType = this.activityType?.value;
    this.currentActivity!.start = this.start?.value;
    this.currentActivity!.end = this.end?.value;
    this.currentActivity!.description = this.description?.value;
    this.currentActivity!.extras = this.extras?.value;

    if (this.currentActivity && this.checkAbleToRequestAddActivity()) {
      this.activityService
        .addActivity(this.currentActivity)
        .pipe(takeUntilDestroyed(this.destroyRef))
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
    this.projectService
      .getProjectsUser(this.localStorageService.loginResponse.userId!)
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
  findProjectNameWithId(projectId: string): string {
    const projectWithId = this.projects?.find(
      (project) => project.id === projectId
    );
    if (projectWithId) return projectWithId.projectName;
    return '';
  }
  getActivityTypes() {
    this.activityService
      .getAllActivityTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.activityTypes = Object.entries(result);
      });
  }

  checkAbleToRequestAddActivity(): boolean {
    if (!this.checkEndStart()) return false;
    if (this.name?.pristine || this.end?.pristine || this.start?.pristine)
      return false;
    if (this.activityType?.value === null) return false;
    if (this.projectName?.value === null) return false;
    return true;
  }

  checkAbleToRequestUpdateActivity(): boolean {
    if (!this.checkEndStart()) return false;
    return true;
  }

  editActivity() {
    this.currentActivity!.name = this.name?.value;
    this.currentActivity!.activityType = this.activityType?.value;
    this.currentActivity!.start = this.start?.value;
    this.currentActivity!.end = this.end?.value;
    this.currentActivity!.description = this.description?.value;
    this.currentActivity!.extras = this.extras?.value;
    if (this.currentActivity && this.checkAbleToRequestUpdateActivity()) {
      this.activityService
        .updateActivity(this.currentActivity)
        .pipe(takeUntilDestroyed(this.destroyRef))
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
          projectId: this.userDateActivity.projectId,
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
      projectName: new FormControl(this.currentActivity?.projectId, [
        Validators.required,
      ]),
      activityType: new FormControl(this.currentActivity?.activityType, [
        Validators.required,
      ]),
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
  get activityType() {
    return this.addActivityForm?.get('activityType');
  }
  get projectName() {
    return this.addActivityForm?.get('projectName');
  }
  get description() {
    return this.addActivityForm?.get('description');
  }
  get extras() {
    return this.addActivityForm?.get('extras');
  }
}
