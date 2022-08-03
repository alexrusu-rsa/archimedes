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
import { ReportingPageComponent } from './ng-modules/reporting/components/reporting-page/reporting-page.component';
import { InvoicePageComponent } from './ng-modules/reporting/components/invoice-page/invoice-page.component';
import { InvoiceDialogComponent } from './ng-modules/reporting/components/invoice-dialog/invoice-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EmployeePipe } from './pipes/employee.pipe';
import { DateRangePipe } from './pipes/date-range.pipe';
import { AdminDashboardPageComponent } from './admin-dashboard-page/admin-dashboard-page.component';
import { RateDialogComponent } from './ng-modules/reporting/components/rate-dialog/rate-dialog.component';
import { CustomPipeModule } from './custom-pipe/custom-pipe.module';
import { FirstUserPageComponent } from './ng-modules/auth/first-user-page/first-user-page.component';
import { UserDashboardComponent } from './ng-modules/reporting/components/user-dashboard/user-dashboard.component';

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
    ReportingPageComponent,
    InvoicePageComponent,
    InvoiceDialogComponent,
    DateRangePipe,
    EmployeePipe,
    AdminDashboardPageComponent,
    RateDialogComponent,
    FirstUserPageComponent,
    UserDashboardComponent,
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
    MatAutocompleteModule,
    CustomPipeModule,
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
  exports: [CustomPipeModule],
})
export class AppModule {}
