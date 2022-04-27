import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { Project } from 'src/app/models/project';
import { CustomerService } from 'src/app/services/customer.service';
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
    private customerService: CustomerService,
    @Inject(MAT_DIALOG_DATA) public currentProjectToUpdate: Project
  ) {}

  addProjectForm?: FormGroup;
  currentProject?: Project;
  addCurrentProjectSub?: Subscription;
  updateProjectSub?: Subscription;
  customers?: Customer[];
  customerNameForm = '';
  selectedItem?: string;
  newProject?: Project;
  getCustomersSub?: Subscription;
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

  getCustomers() {
    this.getCustomersSub = this.customerService
      .getCustomers()
      .subscribe((result) => {
        this.customers = result;
      });
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
    if (this.currentProjectToUpdate) {
      this.currentProject = this.currentProjectToUpdate;
    }
    console.log(this.currentProjectToUpdate);
    this.addProjectForm = new FormGroup({
      customerName: new FormControl(this.currentProject?.customerId),
      name: new FormControl(this.currentProject?.projectName),
    });
    this.getCustomers();
  }
  get customerName() {
    return this.addProjectForm?.get('customerName');
  }
  get name() {
    return this.addProjectForm?.get('name');
  }
}
