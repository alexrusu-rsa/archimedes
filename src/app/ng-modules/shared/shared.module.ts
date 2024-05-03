import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectidPipe } from './pipes/projectid.pipe';
import { EmployeeidPipe } from './pipes/employeeid.pipe';
import { CustomerfromprojectidPipe } from './pipes/customerfromprojectid.pipe';
import { FilterprojectPipe } from './pipes/filterproject.pipe';
import { MaterialModule } from '../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SnackbarContentComponent } from './components/snackbar-content/snackbar-content.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NavigationComponent,
    SnackbarContentComponent,
    ProjectidPipe,
    EmployeeidPipe,
    CustomerfromprojectidPipe,
    FilterprojectPipe,
  ],
  imports: [CommonModule, MaterialModule, TranslateModule, RouterModule],
  exports: [
    NavigationComponent,
    SnackbarContentComponent,
    ProjectidPipe,
    EmployeeidPipe,
    CustomerfromprojectidPipe,
    FilterprojectPipe,
  ],
})
export class SharedModule {}
