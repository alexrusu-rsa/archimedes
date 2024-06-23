import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingPageComponent } from './components/reporting-page/reporting-page.component';
import { RatePageComponent } from './components/rate-page/rate-page.component';

const routes: Routes = [
  {
    path: 'user-reporting',
    component: ReportingPageComponent,
  },
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
