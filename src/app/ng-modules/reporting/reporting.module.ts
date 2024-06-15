import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportingRoutingModule } from './reporting-routing.module';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { EntityPageHeaderComponent } from '../../shared/components/entity-page-header/entity-page-header.component';
import { ProjectidPipe } from 'src/app/shared/pipes/projectid/projectid.pipe';
import { CustomerfromprojectidPipe } from 'src/app/shared/pipes/customerfromprojectid/customerfromprojectid.pipe';

@NgModule({
  declarations: [ProjectPageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    ReportingRoutingModule,
    TranslateModule,
    EntityPageHeaderComponent,
    ProjectidPipe,
    CustomerfromprojectidPipe,
  ],
})
export class ReportingModule {}
