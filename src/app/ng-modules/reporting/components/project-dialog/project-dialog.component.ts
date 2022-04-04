import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.sass'],
})
export class ProjectDialogComponent implements OnInit {
  constructor(
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public project: Project
  ) {}

  addProjectForm?: FormGroup;
  currentProject?: Project;
  addCurrentProjectSub?: Subscription;
  updateProjectSub?: Subscription;

  addProject() {
    if (this.currentProject)
      this.addCurrentProjectSub = this.projectService
        .addProject(this.currentProject)
        .subscribe();
  }

  editProject() {
    if (this.currentProject) {
      this.updateProjectSub = this.projectService
        .updateProject(this.currentProject)
        .subscribe();
    }
  }

  dialogClose() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.currentProject = <Project>{};
    if (this.project !== null) this.currentProject = this.project;
    this.addProjectForm = new FormGroup({
      name: new FormControl(this.currentProject?.projectName),
      customerId: new FormControl(this.currentProject?.customerId),
    });
  }
}
