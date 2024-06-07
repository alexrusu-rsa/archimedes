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
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { UserNavigationComponent } from './components/user-navigation/user-navigation.component';
import { SafePipe } from './pipes/safe.pipe';
import { InitialsIconComponent } from './components/initials-icon/initials-icon.component';

@NgModule({
  declarations: [
    SnackbarContentComponent,
    ToolbarComponent,
    UserNavigationComponent,
    ProjectidPipe,
    EmployeeidPipe,
    CustomerfromprojectidPipe,
    FilterprojectPipe,
    SafePipe,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    RouterModule,
    InitialsIconComponent,
    NavigationComponent,
  ],
  exports: [
    SnackbarContentComponent,
    UserNavigationComponent,
    ToolbarComponent,
    ProjectidPipe,
    EmployeeidPipe,
    CustomerfromprojectidPipe,
    FilterprojectPipe,
    SafePipe,
  ],
})
export class SharedModule {}
