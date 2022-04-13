import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './ng-modules/material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivityPageComponent } from './ng-modules/reporting/components/activity-page/activity-page.component';
import { AuthModule } from './ng-modules/auth/auth.module';
import { SnackbarContentComponent } from './ng-modules/utils/snackbar-content/snackbar-content.component';
import { AuthInterceptor } from './ng-modules/auth/auth.interceptor';
import { UserDialogComponent } from './ng-modules/reporting/components/user-dialog/user-dialog.component';
import { ActivityDialogComponent } from './ng-modules/reporting/components/activity-dialog/activity-dialog.component';
import { CustomerDialogComponent } from './ng-modules/reporting/components/customer-dialog/customer-dialog.component';
import { ProjectDialogComponent } from './ng-modules/reporting/components/project-dialog/project-dialog.component';
import { UserDetailsComponent } from './ng-modules/reporting/components/user-details/user-details.component';

@NgModule({
  declarations: [
    AppComponent,
    ActivityPageComponent,
    SnackbarContentComponent,
    UserDetailsComponent,
    UserDialogComponent,
    ActivityDialogComponent,
    CustomerDialogComponent,
    ProjectDialogComponent,
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
