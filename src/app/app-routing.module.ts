import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { ResetPasswordComponent } from './core/auth/pages/reset-password/reset-password.component';
import { UserAccessGuard } from './core/auth/user-access.guard';
import { RoleGuard } from './core/auth/role.guard';

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
    path: 'customers',
    loadComponent: () =>
      import(
        './features/customer/pages/customer-page/customer-page.component'
      ).then((c) => c.CustomerPageComponent),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/user/pages/user-page/user-page.component').then(
        (c) => c.UserPageComponent
      ),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import(
        './features/settings/pages/settings-page/settings-page.component'
      ).then((c) => c.SettingsPageComponent),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
