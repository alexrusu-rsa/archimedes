import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { domainToASCII } from 'url';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.sass'],
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  allProjects?: Project[];
  allProjectsSubscription?: Subscription;
  deleteProjectSubscription?: Subscription;
  projects?: Project[];

  constructor(
    private projectService: ProjectService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProjects();
  }

  ngOnDestroy(): void {
    this.allProjectsSubscription?.unsubscribe();
    this.deleteProjectSubscription?.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allProjects = this.projects?.filter((project: Project) =>
      project.projectName
        .toLowerCase()
        .includes(filterValue.trim().toLowerCase())
    );
  }
  getProjects() {
    this.allProjectsSubscription = this.projectService
      .getProjects()
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
    dialogRef.afterClosed().subscribe((updatedProject: Project) => {
      this.getProjects();
    });
  }

  deleteProject(projectId: string) {
    this.allProjects = this.allProjects?.filter(
      (project) => project.id !== projectId
    );
    this.deleteProjectSubscription = this.projectService
      .deleteProject(projectId)
      .subscribe();
  }
}
