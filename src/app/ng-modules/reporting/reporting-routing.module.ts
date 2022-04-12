import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { UserDashboardComponent } from './components/user-reporting-page/user-reporting-page.component';
import { RoleGuard } from '../auth/role.guard';
import { UserPageComponent } from './components/user-page/user-page.component';
import { CustomerPageComponent } from './components/customer-page/customer-page.component';

const routes: Routes = [
  { path: 'dashboard/:id', component: UserDashboardComponent },
  {
    path: 'user',
    component: UserPageComponent,
    canActivate: [RoleGuard],
  },
  {
    path: 'customer',
    component: CustomerPageComponent,
    canActivate: [RoleGuard],
  },
  {
    path: 'project',
    component: UserPageComponent,
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
