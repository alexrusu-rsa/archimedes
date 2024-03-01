import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    UserRoutingModule
  ],
  exports: [UserSettingsComponent]
})
export class UserModule { }
