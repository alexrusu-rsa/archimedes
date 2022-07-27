import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectidPipe } from '../pipes/projectid.pipe';
import { EmployeeidPipe } from '../pipes/employeeid.pipe';
import { CustomerfromprojectidPipe } from '../pipes/customerfromprojectid.pipe';

@NgModule({
  declarations: [ProjectidPipe, EmployeeidPipe, CustomerfromprojectidPipe],
  imports: [CommonModule],
  exports: [ProjectidPipe, EmployeeidPipe, CustomerfromprojectidPipe],
})
export class CustomPipeModule {}
