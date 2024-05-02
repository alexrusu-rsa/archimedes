import { NgModule } from '@angular/core';
import { MaterialModule } from './../material/material.module';
import { InitialsIconComponent } from './components/initials-icon/initials-icon.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { UserNavigationComponent } from './components/user-navigation/user-navigation.component';
import { RouterModule } from '@angular/router';

const importsExports = [
  MaterialModule,
  TranslateModule,
  CommonModule,
  RouterModule,
];
const declares = [
  InitialsIconComponent,
  ToolbarComponent,
  UserNavigationComponent,
];

@NgModule({
  declarations: declares,
  imports: importsExports,
  exports: [...importsExports, ...declares],
})
export class SharedModule {}
