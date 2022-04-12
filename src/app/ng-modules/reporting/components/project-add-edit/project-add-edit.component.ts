import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { Project } from 'src/app/models/project';
import { ProjectCustomersPack } from 'src/app/models/projectCustomersPack';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-add-edit',
  templateUrl: './project-add-edit.component.html',
  styleUrls: ['./project-add-edit.component.sass'],
})
export class ProjectDialogComponent implements OnInit {
  constructor(
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public projectCustomers: ProjectCustomersPack
  ) {}

  addProjectForm?: FormGroup;
  currentProject?: Project;
  addCurrentProjectSub?: Subscription;
  updateProjectSub?: Subscription;
  customers?: Customer[];
  customerNameForm = '';
  selectedItem?: string;
  newProject?: Project;

  addProject() {
    if (this.checkAbleToRequestAddProject())
      if (this.currentProject)
        this.addCurrentProjectSub = this.projectService
          .addProject(this.currentProject)
          .subscribe();
  }

  editProject() {
    if (this.checkAbleToRequestUpdateProject())
      if (this.currentProject) {
        this.updateProjectSub = this.projectService
          .updateProject(this.currentProject)
          .subscribe();
      }
  }

  checkAbleToRequestAddProject(): boolean {
    if (this.name?.pristine || this.customerName?.pristine) return false;
    return true;
  }

  checkAbleToRequestUpdateProject(): boolean {
    if (this.name?.value !== '' && this.customerName?.value !== '') return true;
    return false;
  }

  dialogClose() {
    this.dialogRef.close();
  }

  checkAndAdd() {
    this.newProject!.customerId = this.customerName?.value;
    this.newProject!.projectName = this.name?.value;
    this.currentProject = this.newProject;
    this.addProject();
  }

  checkAndUpdate() {
    this.newProject!.id = this.currentProject?.id;
    this.newProject!.customerId = this.customerName?.value;
    this.newProject!.projectName = this.name?.value;
    this.currentProject = this.newProject;
    this.editProject();
  }

  ngOnInit(): void {
    this.currentProject = <Project>{};
    this.newProject = <Project>{};
    this.customers = this.projectCustomers.customers;

    if (this.projectCustomers.project !== undefined) {
      this.currentProject = this.projectCustomers.project;
    }
    this.addProjectForm = new FormGroup({
      customerName: new FormControl(this.currentProject?.customerId),
      name: new FormControl(this.currentProject?.projectName),
    });
  }
  get customerName() {
    return this.addProjectForm?.get('customerName');
  }
  get name() {
    return this.addProjectForm?.get('name');
  }
}
