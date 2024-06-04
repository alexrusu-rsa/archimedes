import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportingRoutingModule } from './reporting-routing.module';
import { UserPageComponent } from './components/user-page/user-page.component';
import { CustomerPageComponent } from './components/customer-page/customer-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { SharedModule } from 'src/app/ng-modules/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { DuplicateActivityModalComponent } from 'src/app/features/activity/components/duplicate-activity-modal/duplicate-activity-modal.component';

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
    SharedModule,
    TranslateModule,
    DuplicateActivityModalComponent
  ],
})
export class ReportingModule {}
