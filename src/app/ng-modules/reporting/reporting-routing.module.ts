import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementPageComponent } from './components/management-page/management-page.component';
import { AuthGuard } from '../auth/auth.guard';
import { UserDashboardComponent } from './components/user-activity/user-activity-reporting.component';
import { RoleGuard } from '../auth/role.guard';

const routes: Routes = [
  { path: 'dashboard/:id', component: UserDashboardComponent },
  {
    path: 'management',
    component: ManagementPageComponent,
    canActivate: [RoleGuard],
  },
  {
    path: '',
    redirectTo: 'dashboard/:id',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
