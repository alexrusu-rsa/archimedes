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
    path: 'activity',
    title: 'Activity',
    loadComponent: () =>
      import(
        './features/activity/pages/activity-page/activity-page.component'
      ).then((c) => c.ActivityPageComponent),
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
    path: 'rate',
    loadComponent: () =>
      import('./features/rate/pages/rate-page/rate-page.component').then(
        (c) => c.RatePageComponent
      ),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import(
        './features/dashboard/pages/dashboard-page/dashboard-page.component'
      ).then((c) => c.DashboardPageComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'project',
    loadComponent: () =>
      import(
        './features/project/pages/project-page/project-page.component'
      ).then((c) => c.ProjectPageComponent),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import(
        './features/invoice/pages/invoice-page/invoice-page.component'
      ).then((c) => c.InvoicePageComponent),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'reporting',
    loadComponent: () =>
      import(
        './features/reporting/pages/reporting-page/reporting-page.component'
      ).then((c) => c.ReportingPageComponent),
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
