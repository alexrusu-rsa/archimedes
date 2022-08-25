import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportingRoutingModule } from './reporting-routing.module';
import { UserPageComponent } from './components/user-page/user-page.component';
import { CustomerPageComponent } from './components/customer-page/customer-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { CustomPipeModule } from 'src/app/custom-pipe/custom-pipe.module';

@NgModule({
  declarations: [
    UserPageComponent,
    CustomerPageComponent,
    ProjectPageComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    ReportingRoutingModule,
    CustomPipeModule,
  ],
})
export class ReportingModule {}
