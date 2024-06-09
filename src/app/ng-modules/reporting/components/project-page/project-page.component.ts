import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Project } from 'src/app/shared/models/project';
import { CustomerService } from 'src/app/features/customer/services/customer-service/customer.service';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DeleteConfirmationModalComponent,
  deleteConfirmationModalPreset,
} from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { Customer } from 'src/app/shared/models/customer';
import { ProjectService } from 'src/app/features/project/services/project-service/project.service';

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
        this.projects = result;
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
    const dialogRef = this.dialog.open(
      DeleteConfirmationModalComponent,
      deleteConfirmationModalPreset
    );
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.allProjects = this.allProjects?.filter(
          (project) => project.id !== projectId
        );
      }
    });
  }
}
