import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../core/auth/role.guard';
import { ReportingPageComponent } from './components/reporting-page/reporting-page.component';
import { ProjectPageComponent } from '../../features/project/pages/project-page/project-page.component';
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
  { path: 'rate', component: RatePageComponent },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
