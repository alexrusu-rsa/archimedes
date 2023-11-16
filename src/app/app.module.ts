import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './ng-modules/material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  DatePipe,
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
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
import { UserSettingsPageComponent } from './ng-modules/reporting/user-settings-page/user-settings-page.component';
import { DuplicateActivityDialogComponent } from './ng-modules/reporting/components/duplicate-activity-dialog/duplicate-activity-dialog.component';
import { DeleteConfirmationDialogComponent } from './ng-modules/reporting/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { NewUserDialogComponent } from './ng-modules/reporting/components/new-user-dialog/new-user-dialog.component';
import { UserDashboardComponent } from './ng-modules/reporting/components/user-dashboard/user-dashboard.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from './ng-modules/utils/http-loader-factory';
import { ReportingHoursBookedDialogComponent } from './ng-modules/reporting/components/reporting-hours-booked-dialog/reporting-hours-booked-dialog.component';
import { MonthViewComponent } from './ng-modules/reporting/components/month-view/month-view.component';
import { MonthViewDialogComponent } from './ng-modules/reporting/components/month-view-dialog/month-view-dialog.component';
import { RatePageComponent } from './ng-modules/reporting/rate-page/rate-page.component';
import { ShortenPipe } from './pipes/shorten.pipe';

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
    UserSettingsPageComponent,
    DuplicateActivityDialogComponent,
    DeleteConfirmationDialogComponent,
    NewUserDialogComponent,
    UserDashboardComponent,
    ReportingHoursBookedDialogComponent,
    MonthViewComponent,
    MonthViewDialogComponent,
    RatePageComponent,
    ShortenPipe,
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    DatePipe,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
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
