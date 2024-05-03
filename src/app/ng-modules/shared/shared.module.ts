import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectidPipe } from './pipes/projectid.pipe';
import { EmployeeidPipe } from './pipes/employeeid.pipe';
import { CustomerfromprojectidPipe } from './pipes/customerfromprojectid.pipe';
import { FilterprojectPipe } from './pipes/filterproject.pipe';

@NgModule({
  declarations: [
    ProjectidPipe,
    EmployeeidPipe,
    CustomerfromprojectidPipe,
    FilterprojectPipe,
  ],
  imports: [CommonModule],
  exports: [
    ProjectidPipe,
    EmployeeidPipe,
    CustomerfromprojectidPipe,
    FilterprojectPipe,
  ],
})
export class SharedModule {}
