import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './ng-modules/auth/auth.guard';
import { LoginComponent } from './ng-modules/auth/login/login.component';
import { ResetPasswordComponent } from './ng-modules/auth/reset-password/reset-password.component';
import { UserDetailsComponent } from './ng-modules/reporting/components/user-details/user-details.component';
import { UserAccessGuard } from './ng-modules/auth/user-access.guard';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [UserAccessGuard],
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
    path: '**',
    redirectTo: 'reporting',
  },
  {
    path: 'employee/:id',
    component: UserDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
