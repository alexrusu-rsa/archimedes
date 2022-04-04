import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './ng-modules/material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ActivityDialogComponent } from './ng-modules/reporting/components/activity-dialog/activity-dialog.component';
import { EditActivityComponent } from './ng-modules/reporting/components/edit-activity/edit-activity.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDashboardComponent } from './ng-modules/reporting/components/user-dashboard/user-dashboard.component';
import { AuthModule } from './ng-modules/auth/auth.module';
import { SnackbarContentComponent } from './ng-modules/utils/snackbar-content/snackbar-content.component';
import { AuthInterceptor } from './ng-modules/auth/auth.interceptor';
import { EmployeeDetailsComponent } from './ng-modules/reporting/components/employee-details/employee-details.component';
import { UserDialogComponent } from './ng-modules/reporting/components/user-dialog/user-dialog.component';
import { ActivityAddEditComponent } from './ng-modules/reporting/components/activity-add-edit/activity-add-edit.component';



@NgModule({
  declarations: [
    AppComponent,
    ActivityDialogComponent,
    EditActivityComponent,
    UserDashboardComponent,
    SnackbarContentComponent,
    EmployeeDetailsComponent,
    UserDialogComponent,
    ActivityAddEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AuthModule,
    ReactiveFormsModule,
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
