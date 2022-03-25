import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementPageComponent } from './components/management-page/management-page.component';
import { AuthGuard } from '../auth/auth.guard';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';

const routes: Routes = [
  { path: 'dashboard/:id', component: UserDashboardComponent },
  { path: 'management', component: ManagementPageComponent },
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
