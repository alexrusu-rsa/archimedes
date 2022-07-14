import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { ConsoleLogger } from '@angular/compiler-cli';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { Project } from 'src/app/models/project';
import { Rate } from 'src/app/models/rate';
import { User } from 'src/app/models/user';
import { ProjectService } from 'src/app/services/project.service';
import { RateService } from 'src/app/services/rate.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-rate-dialog',
  templateUrl: './rate-dialog.component.html',
  styleUrls: ['./rate-dialog.component.sass'],
})
export class RateDialogComponent implements OnInit {
  currentRate?: Rate;
  addRateForm?: FormGroup;
  addRateSub?: Subscription;
  updateRateSub?: Subscription;
  projects?: Project[];
  users?: User[];
  usersSub?: Subscription;
  projectsSub?: Subscription;
  filteredProjects?: Observable<Project[]>;
  filteredUsers?: Observable<User[]>;
  selectedItemProject?: string;
  selectedItemEmployee?: string;

  constructor(
    public dialogRef: MatDialogRef<RateDialogComponent>,
    private userService: UserService,
    private projectService: ProjectService,
    private rateService: RateService,
    @Inject(MAT_DIALOG_DATA) public rate: Rate
  ) {}

  addRate() {
    if (this.checkAbleToRequestAddRate()) {
      this.currentRate!.projectId = this.projectId?.value;
      this.currentRate!.employeeId = this.employeeId?.value;
      console.log(this.currentRate);
      this.addRateSub = this.rateService
        .addRate(this.currentRate!)
        .subscribe((newRate: Rate) => {
          this.dialogRef.close(newRate);
        });
    }
  }
  editRate() {
    console.log(this.currentRate);
    if (this.checkAbleToRequestUpdateRate()) {
      this.updateRateSub = this.rateService
        .updateRate(this.currentRate!)
        .subscribe((updatedRate: Rate) => {
          this.dialogRef.close(updatedRate);
        });
    }
  }

  onSelectionChange(event: any) {
    const selectedProjectId = this.projects?.find(
      (project) => project.projectName === event.option.value
    );
    if (selectedProjectId?.id && this.currentRate)
      this.currentRate.projectId = selectedProjectId!.id;
  }

  findEmployeeNameWithId(employeeId: string): string {
    const employeeWithId = this.users?.find(
      (employee) => employee.id === employeeId
    );
    if (employeeWithId)
      return `${employeeWithId.name} ${employeeWithId.surname}`;
    return '';
  }

  onSelectionChangeEmp(event: any) {
    const selectedEmployeeId = this.users?.find(
      (user) => user.name === event.option.value
    );
    if (selectedEmployeeId?.id && this.currentRate)
      this.currentRate.employeeId = selectedEmployeeId!.id;
  }

  getProjects() {
    this.projectsSub = this.projectService.getProjects().subscribe((result) => {
      this.projects = result;
      this.filteredProjects = this.projectId?.valueChanges.pipe(
        startWith(''),
        map((value) => this.filter(value))
      );
    });
  }

  private filter(value: string): Project[] {
    const filterValue = value.toLowerCase();
    return this.projects!.filter((project) =>
      project.projectName.toLowerCase().includes(filterValue)
    );
  }

  private filterEmp(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users!.filter((user) =>
      user.name.toLowerCase().includes(filterValue)
    );
  }

  findProjectNameWithId(projectId: string): string {
    const projectWithId = this.projects?.find(
      (project) => project.id === projectId
    );
    if (projectWithId) return projectWithId.projectName;
    return '';
  }

  getEmployees() {
    this.usersSub = this.userService.getUsers().subscribe((result) => {
      this.users = result;
      this.filteredUsers = this.employeeId?.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterEmp(value))
      );
    });
  }

  checkAbleToRequestAddRate(): boolean {
    return true;
  }

  checkAbleToRequestUpdateRate(): boolean {
    return true;
  }

  ngOnInit(): void {
    this.currentRate = <Rate>{};
    this.getEmployees();
    this.getProjects();
    if (this.rate !== null) {
      this.currentRate = this.rate;
    }
    console.log(this.currentRate);

    this.addRateForm = new FormGroup({
      projectId: new FormControl(this.currentRate?.projectId),
      employeeId: new FormControl(this.currentRate?.employeeId),
      employeeRate: new FormControl(this.currentRate?.rate),
      employeeRateType: new FormControl(this.currentRate?.rateType),
      employeeTimeCommitement: new FormControl(
        this.currentRate?.employeeTimeCommitement
      ),
    });
  }

  get projectId() {
    return this.addRateForm?.get('projectId');
  }

  get employeeId() {
    return this.addRateForm?.get('employeeId');
  }

  get employeeRate() {
    return this.addRateForm?.get('employeeRate');
  }

  get employeeRateType() {
    return this.addRateForm?.get('employeeRateType');
  }

  get emplpoyeeTimeCommitement() {
    return this.addRateForm?.get('emplpoyeeTimeCommitement');
  }
}
