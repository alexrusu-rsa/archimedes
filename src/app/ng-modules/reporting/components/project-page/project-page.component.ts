import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { Project } from 'src/app/models/project';
import { CustomerService } from 'src/app/services/customer-service/customer.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.sass'],
})
export class ProjectPageComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  allProjects?: Project[] = [];
  projects?: Project[];
  allCustomers?: Customer[] = [];

  constructor(
    private projectService: ProjectService,
    public dialog: MatDialog,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allProjects = this.projects?.filter((project: Project) =>
      project.projectName
        .toLowerCase()
        .includes(filterValue.trim().toLowerCase())
    );
  }

  fetchData() {
    this.customerService
      .getCustomers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((customers) => {
          this.allCustomers = customers;
          return this.projectService.getProjects();
        })
      )
      .subscribe((result) => {
        this.allProjects = result;
      });
  }

  addProject() {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      panelClass: 'full-width-dialog',
    });
    dialogRef.afterClosed().subscribe((newProject: Project) => {
      if (newProject) this.allProjects?.push(newProject);
    });
  }

  editProject(project: Project) {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      data: project,
      panelClass: 'full-width-dialog',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchData();
    });
  }

  deleteProject(projectId: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      panelClass: 'delete-confirmation-dialog',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.allProjects = this.allProjects?.filter(
          (project) => project.id !== projectId
        );
      }
    });
  }
}
