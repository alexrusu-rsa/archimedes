import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportingRoutingModule } from './reporting-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { EntityPageHeaderComponent } from '../../shared/components/entity-page-header/entity-page-header.component';
import { ProjectidPipe } from 'src/app/shared/pipes/projectid/projectid.pipe';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    ReportingRoutingModule,
    TranslateModule,
    EntityPageHeaderComponent,
    ProjectidPipe,
  ],
})
export class ReportingModule {}
