import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectidPipe } from './pipes/projectid.pipe';
import { EmployeeidPipe } from './pipes/employeeid.pipe';
import { CustomerfromprojectidPipe } from './pipes/customerfromprojectid.pipe';
import { FilterprojectPipe } from './pipes/filterproject.pipe';
import { MaterialModule } from '../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { UserNavigationComponent } from '../../shared/components/user-navigation/user-navigation.component';
import { SafePipe } from './pipes/safe.pipe';
import { InitialsIconComponent } from '../../shared/components/initials-icon/initials-icon.component';

@NgModule({
  declarations: [
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
    UserNavigationComponent,
    InitialsIconComponent,
    NavigationComponent,
  ],
  exports: [
    ProjectidPipe,
    EmployeeidPipe,
    CustomerfromprojectidPipe,
    FilterprojectPipe,
    SafePipe,
  ],
})
export class SharedModule {}
