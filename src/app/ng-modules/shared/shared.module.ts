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
import { InitialsIconComponent } from './components/initials-icon/initials-icon.component';
import { UserNavigationComponent } from './components/user-navigation/user-navigation.component';
import { EntityPageHeaderComponent } from './components/entity-page-header/entity-page-header.component';

@NgModule({
  declarations: [
    NavigationComponent,
    SnackbarContentComponent,
    ToolbarComponent,
    InitialsIconComponent,
    UserNavigationComponent,
    ProjectidPipe,
    EmployeeidPipe,
    CustomerfromprojectidPipe,
    FilterprojectPipe,
    EntityPageHeaderComponent,
  ],
  imports: [CommonModule, MaterialModule, TranslateModule, RouterModule],
  exports: [
    NavigationComponent,
    SnackbarContentComponent,
    UserNavigationComponent,
    ToolbarComponent,
    InitialsIconComponent,
    ProjectidPipe,
    EmployeeidPipe,
    CustomerfromprojectidPipe,
    FilterprojectPipe,
    EntityPageHeaderComponent,
  ],
})
export class SharedModule {}
