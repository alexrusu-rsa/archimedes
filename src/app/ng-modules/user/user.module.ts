import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';
import { UserFacade } from './user.facade';
import { SharedModule } from '../shared/shared.module';
import { UserManagementComponent } from './components/user-management/user-management.component';

@NgModule({
  declarations: [UserSettingsComponent, UserManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    UserRoutingModule,
  ],
  exports: [UserSettingsComponent, UserManagementComponent],
  providers: [UserFacade],
})
export class UserModule {}
