import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { Project } from 'src/app/shared/models/project';
import { Rate } from 'src/app/shared/models/rate';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { RateService } from 'src/app/services/rate-service/rate.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { Icons } from 'src/app/shared/models/icons.enum';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-rate-dialog',
  templateUrl: './rate-dialog.component.html',
  styleUrls: ['./rate-dialog.component.sass'],
})
export class RateDialogComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  protected icons = Icons;
  currentRate?: Rate;
  addRateForm?: FormGroup;
  projects?: Project[];
  users?: User[];
  filteredProjects?: Observable<Project[]>;
  filteredUsers?: Observable<User[]>;
  selectedItemProject?: string;
  selectedItemEmployee?: string;
  allRateTypes?: [string, string][];

  constructor(
    public dialogRef: MatDialogRef<RateDialogComponent>,
    private userService: UserService,
    private projectService: ProjectService,
    private rateService: RateService,
    @Inject(MAT_DIALOG_DATA) public rate: Rate
  ) {}

  addRate() {
    if (this.checkAbleToRequestAddRate()) {
      this.currentRate.projectId = this.projectId?.value;
      this.currentRate.employeeId = this.employeeId?.value;
      this.currentRate.rateType = this.employeeRateType?.value;
      this.rateService
        .addRate(this.currentRate)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((newRate: Rate) => {
          this.dialogRef.close(newRate);
        });
    }
  }

  editRate() {
    if (this.checkAbleToRequestUpdateRate()) {
      this.currentRate.projectId = this.projectId?.value;
      this.currentRate.employeeId = this.employeeId?.value;
      this.currentRate.rateType = this.employeeRateType?.value;
      this.rateService
        .updateRate(this.currentRate)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((updatedRate: Rate) => {
          this.dialogRef.close(updatedRate);
        });
    }
  }

  async getRateTypes() {
    await this.rateService
      .getAllRateTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.allRateTypes = Object.entries(result);
      });
  }

  getProjects() {
    this.projectService
      .getProjects()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.projects = result;
        this.filteredProjects = this.projectId?.valueChanges.pipe(
          startWith(''),
          map((value) => this.filter(value))
        );
      });
  }
  getEmployees() {
    this.userService
      .getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.users = result;
        this.filteredUsers = this.employeeId?.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterEmp(value))
        );
      });
  }

  private filter(value: string): Project[] {
    const filterValue = value.toLowerCase();
    return this.projects.filter((project) =>
      project.projectName.toLowerCase().includes(filterValue)
    );
  }

  private filterEmp(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((user) =>
      user.name.toLowerCase().includes(filterValue)
    );
  }

  checkAbleToRequestAddRate(): boolean {
    if (this.addRateForm?.valid) return true;
    return false;
  }

  checkAbleToRequestUpdateRate(): boolean {
    if (this.addRateForm?.valid) return true;
    return false;
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
  ngOnInit(): void {
    this.currentRate = <Rate>{};
    this.getEmployees();
    this.getProjects();
    const rateFormat = /^\d+[.,]\d+$/;
    if (this.rate !== null) {
      this.currentRate = this.rate;
      this.selectedItemEmployee = this.rate.employeeId;
      this.selectedItemProject = this.rate.projectId;
    }

    this.addRateForm = new FormGroup({
      projectId: new FormControl(this.currentRate?.projectId, [
        Validators.required,
      ]),
      employeeId: new FormControl(this.currentRate?.employeeId, [
        Validators.required,
      ]),
      employeeRate: new FormControl(this.currentRate?.rate, [
        Validators.required,
        Validators.pattern(rateFormat),
      ]),
      employeeRateType: new FormControl(this.currentRate?.rateType, [
        Validators.required,
      ]),
      employeeTimeCommitement: new FormControl(
        this.currentRate?.employeeTimeCommitement,
        [Validators.required]
      ),
    });
    this.getRateTypes();
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
