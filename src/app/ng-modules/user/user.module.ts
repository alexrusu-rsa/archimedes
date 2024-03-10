import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';
import { UserFacade } from './user.facade';
import { SharedModule } from '../shared/shared.module';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';

@NgModule({
  declarations: [
    UserSettingsComponent,
    UserManagementComponent,
    UserModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    UserRoutingModule,
  ],
  exports: [UserSettingsComponent, UserManagementComponent, UserModalComponent],
  providers: [UserFacade],
})
export class UserModule {}
