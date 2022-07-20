import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectidPipe } from '../pipes/projectid.pipe';
import { EmployeeidPipe } from '../pipes/employeeid.pipe';

@NgModule({
  declarations: [ProjectidPipe, EmployeeidPipe],
  imports: [CommonModule],
  exports: [ProjectidPipe, EmployeeidPipe],
})
export class CustomPipeModule {}
