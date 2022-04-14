import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.sass'],
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  allProjects: Project[] = [];
  allProjectsSubscription?: Subscription;
  deleteProjectSubscription?: Subscription;

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

  getProjects() {
    this.allProjectsSubscription = this.projectService
      .getProjects()
      .subscribe((result) => {
        this.allProjects = result;
      });
  }

  addProject() {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '33vw',
    });

    dialogRef.afterClosed().subscribe((newProject: Project) => {
      if (newProject) this.allProjects.push(newProject);
    });
  }

  editProject(project: Project) {
    this.dialog.open(ProjectDialogComponent, {
      data: {
        project: project,
      },
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
