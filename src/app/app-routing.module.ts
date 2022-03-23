import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './ng-modules/auth/auth.guard';
import { LoginComponent } from './ng-modules/auth/login/login.component';
import { ResetPasswordComponent } from './ng-modules/auth/reset-password/reset-password.component';
import { EmployeeDetailsComponent } from './ng-modules/reporting/components/employee-details/employee-details.component';

const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'resetpassword', component: ResetPasswordComponent },
    ],
  },
  {
    path: 'reporting',
    loadChildren: () =>
      import('./ng-modules/reporting/reporting.module').then(
        (m) => m.ReportingModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'employee/:id',
    component: EmployeeDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
