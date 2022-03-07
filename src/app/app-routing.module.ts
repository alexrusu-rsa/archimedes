import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveDayComponent } from './active-day/active-day.component';
import { DayComponent } from './day/day.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

const routes: Routes = [
  { path: 'forgot-password', component: ResetPasswordComponent },
  { path: '', component: LoginComponent },
  { path: 'day', component: DayComponent },
  { path: 'login', component: LoginComponent },
  { path: 'active-day', component: ActiveDayComponent },
  { path: 'day/:id', component: DayComponent },
  { path: 'dashboard/:id', component: UserDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
