import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Project } from 'src/app/shared/models/project';
import { Rate } from 'src/app/shared/models/rate';
import { RateService } from 'src/app/features/rate/services/rate-service/rate.service';
import { RateDialogComponent } from '../rate-dialog/rate-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DeleteConfirmationModalComponent,
  deleteConfirmationModalPreset,
} from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { Icons } from 'src/app/shared/models/icons.enum';
import { User } from 'src/app/shared/models/user';
import { ProjectService } from 'src/app/features/project/services/project-service/project.service';
import { UserService } from 'src/app/features/user/services/user-service/user.service';

@Component({
  selector: 'app-rate-page',
  templateUrl: './rate-page.component.html',
  styleUrls: ['./rate-page.component.sass'],
})
export class RatePageComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  allUsers: User[] = [];
  projects: Project[] = [];
  allRates: Rate[] = [];
  displayedColumns: string[] = [
    'projectId',
    'employeeId',
    'rate',
    'rateType',
    'employeeTimeCommitement',
    'editButton',
    'deleteButton',
  ];
  protected readonly icons = Icons;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private rateService: RateService,
    public dialog: MatDialog
  ) {}

  fetchData() {
    this.userService
      .getUsers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((users) => {
          this.allUsers = users;
          return this.projectService.getProjects();
        }),
        switchMap((projects) => {
          this.projects = projects;
          return this.rateService.getRates();
        })
      )
      .subscribe((rates) => {
        this.allRates = rates;
      });
  }
  ngOnInit(): void {
    this.fetchData();
  }

  deleteRate(rate: Rate) {
    const dialogRef = this.dialog.open(
      DeleteConfirmationModalComponent,
      deleteConfirmationModalPreset
    );
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.rateService
          .deleteRate(rate.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.fetchData();
          });
      }
    });
  }

  editRate(rate: Rate) {
    const dialogRef = this.dialog.open(RateDialogComponent, {
      data: rate,
      panelClass: 'full-width-dialog',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchData();
    });
  }

  addRate() {
    const dialogRef = this.dialog.open(RateDialogComponent, {
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fetchData();
    });
  }
}
