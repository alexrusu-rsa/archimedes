import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { Project } from 'src/app/models/project';
import { CustomerService } from 'src/app/services/customer.service';
import { ProjectService } from 'src/app/services/project.service';
import { domainToASCII } from 'url';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.sass'],
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  allProjects?: Project[];
  projects?: Project[];
  allCustomers?: Customer[];
  subscriptionArray?: Subscription[];

  constructor(
    private projectService: ProjectService,
    public dialog: MatDialog,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.getProjects();
    this.getCustomers();
  }

  ngOnDestroy(): void {
    this.subscriptionArray?.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allProjects = this.projects?.filter((project: Project) =>
      project.projectName
        .toLowerCase()
        .includes(filterValue.trim().toLowerCase())
    );
  }

  getCustomers() {
    this.subscriptionArray?.push(
      this.customerService.getCustomers().subscribe((result) => {
        this.allCustomers = result;
      })
    );
  }

  getProjects() {
    this.subscriptionArray?.push(
      this.projectService.getProjects().subscribe((result) => {
        this.allProjects = result;
        this.projects = result;
      })
    );
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
    dialogRef.afterClosed().subscribe((updatedProject: Project) => {
      this.getProjects();
    });
  }

  deleteProject(projectId: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      panelClass: 'full-width-dialog',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.allProjects = this.allProjects?.filter(
          (project) => project.id !== projectId
        );
        this.subscriptionArray?.push(
          this.projectService.deleteProject(projectId).subscribe()
        );
      }
    });
  }
}
