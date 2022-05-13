import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ActivityPageComponent } from './components/activity-page/activity-page.component';
import { RoleGuard } from '../auth/role.guard';
import { UserPageComponent } from './components/user-page/user-page.component';
import { CustomerPageComponent } from './components/customer-page/customer-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import {
  InvoicePageComponent,
} from './components/invoice-page/invoice-page.component';

const routes: Routes = [
  { path: 'dashboard/:id', component: ActivityPageComponent },
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
    component: ProjectPageComponent,
    canActivate: [RoleGuard],
  },
  {
    path: 'invoice',
    component: InvoicePageComponent,
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
