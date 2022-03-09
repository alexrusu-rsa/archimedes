import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './ng-modules/material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { DatePipe } from '@angular/common';
import { ActivityDialogComponent } from './ng-modules/reporting/components/activity-dialog/activity-dialog.component';
import { EditActivityComponent } from './ng-modules/reporting/components/edit-activity/edit-activity.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './ng-modules/reporting/components/user-dashboard/user-dashboard.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
@NgModule({
  declarations: [
    AppComponent,
    ActivityDialogComponent,
    EditActivityComponent,
    LoginComponent,
    UserDashboardComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
