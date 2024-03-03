import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

const routes: Routes = [
  { path: 'settings', component: UserSettingsComponent },
  { path: 'management', component: UserManagementComponent },
  {
    path: '',
    redirectTo: 'management',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
