import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../core/auth/role.guard';
import { ReportingPageComponent } from './components/reporting-page/reporting-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { AdminDashboardPageComponent } from 'src/app/ng-modules/reporting/components/admin-dashboard-page/admin-dashboard-page.component';
import { RatePageComponent } from './components/rate-page/rate-page.component';

const routes: Routes = [
  {
    path: 'project',
    component: ProjectPageComponent,
    canActivate: [RoleGuard],
  },
  {
    path: 'user-reporting',
    component: ReportingPageComponent,
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardPageComponent,
    canActivate: [RoleGuard],
  },
  { path: 'rate', component: RatePageComponent },
  {
    path: '',
    redirectTo: 'admin-dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
