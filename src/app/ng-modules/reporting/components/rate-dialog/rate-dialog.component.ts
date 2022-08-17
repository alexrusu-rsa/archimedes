import { ConsoleLogger } from '@angular/compiler-cli';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
export class RateDialogComponent implements OnInit, OnDestroy {
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
  allRateTypes?: [string, string][];
  getAllRateTypesSub?: Subscription;

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
      this.currentRate!.rateType = this.employeeRateType?.value;
      this.addRateSub = this.rateService
        .addRate(this.currentRate!)
        .subscribe((newRate: Rate) => {
          this.dialogRef.close(newRate);
        });
    }
  }

  editRate() {
    if (this.checkAbleToRequestUpdateRate()) {
      this.currentRate!.projectId = this.projectId?.value;
      this.currentRate!.employeeId = this.employeeId?.value;
      this.currentRate!.rateType = this.employeeRateType?.value;
      this.updateRateSub = this.rateService
        .updateRate(this.currentRate!)
        .subscribe((updatedRate: Rate) => {
          this.dialogRef.close(updatedRate);
        });
    }
  }

  async getRateTypes() {
    this.getAllRateTypesSub = await this.rateService
      .getAllRateTypes()
      .subscribe((result) => {
        this.allRateTypes = Object.entries(result);
      });
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
  getEmployees() {
    this.usersSub = this.userService.getUsers().subscribe((result) => {
      this.users = result;
      this.filteredUsers = this.employeeId?.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterEmp(value))
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
      this.selectedItemEmployee = this.rate.employeeId;
      this.selectedItemProject = this.rate.projectId;
    }

    this.addRateForm = new FormGroup({
      projectId: new FormControl(this.currentRate?.projectId),
      employeeId: new FormControl(this.currentRate?.employeeId),
      employeeRate: new FormControl(this.currentRate?.rate),
      employeeRateType: new FormControl(this.currentRate?.rateType),
      employeeTimeCommitement: new FormControl(
        this.currentRate?.employeeTimeCommitement
      ),
    });
    this.getRateTypes();
  }

  ngOnDestroy(): void {
    this.getAllRateTypesSub?.unsubscribe();
    this.addRateSub?.unsubscribe();
    this.usersSub?.unsubscribe();
    this.projectsSub?.unsubscribe();
    this.updateRateSub?.unsubscribe();
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
