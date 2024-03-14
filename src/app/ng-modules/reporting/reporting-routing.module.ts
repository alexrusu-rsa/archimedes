import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityPageComponent } from './components/activity-page/activity-page.component';
import { RoleGuard } from '../auth/role.guard';
import { UserPageComponent } from './components/user-page/user-page.component';
import { ReportingPageComponent } from './components/reporting-page/reporting-page.component';
import { InvoicePageComponent } from './components/invoice-page/invoice-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { AdminDashboardPageComponent } from 'src/app/admin-dashboard-page/admin-dashboard-page.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { RatePageComponent } from './rate-page/rate-page.component';
import { CustomerPageComponent } from '../customer/components/customer-page/customer-page.component';

const routes: Routes = [
  {
    path: 'activity/:id',
    component: ActivityPageComponent,
  },
  {
    path: 'user',
    component: UserPageComponent,
    canActivate: [RoleGuard],
  },
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
    path: 'invoice',
    component: InvoicePageComponent,
    canActivate: [RoleGuard],
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardPageComponent,
    canActivate: [RoleGuard],
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent,
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
