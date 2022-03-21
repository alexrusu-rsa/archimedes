import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementPageComponent } from './components/management-page/management-page.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';

const routes: Routes = [
  { path: 'dashboard/:id', component: UserDashboardComponent },
  { path: '', redirectTo: 'dashboard/:id', pathMatch: 'full' },
  { path: 'management', component: ManagementPageComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
