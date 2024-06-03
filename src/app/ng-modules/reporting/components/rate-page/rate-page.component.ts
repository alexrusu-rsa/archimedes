import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Project } from 'src/app/models/project';
import { Rate } from 'src/app/models/rate';
import { User } from 'src/app/models/user';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { RateService } from 'src/app/services/rate-service/rate.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { DeleteConfirmationDialogComponent } from '../../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { RateDialogComponent } from '../rate-dialog/rate-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Icons } from 'src/app/models/icons.enum';

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
  icons = Icons;

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
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      panelClass: 'delete-confirmation-dialog',
    });
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
