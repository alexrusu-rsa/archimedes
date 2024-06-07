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
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivityPageComponent } from './ng-modules/reporting/components/activity-page/activity-page.component';
import { AuthModule } from './ng-modules/auth/auth.module';
import { AuthInterceptor } from './ng-modules/auth/auth.interceptor';
import { UserDialogComponent } from './ng-modules/reporting/components/user-dialog/user-dialog.component';
import { ActivityDialogComponent } from './ng-modules/reporting/components/activity-dialog/activity-dialog.component';
import { CustomerDialogComponent } from './ng-modules/reporting/components/customer-dialog/customer-dialog.component';
import { ProjectDialogComponent } from './ng-modules/reporting/components/project-dialog/project-dialog.component';
import { ReportingPageComponent } from './ng-modules/reporting/components/reporting-page/reporting-page.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EmployeePipe } from './ng-modules/shared/pipes/employee.pipe';
import { DateRangePipe } from './ng-modules/shared/pipes/date-range.pipe';
import { AdminDashboardPageComponent } from './ng-modules/reporting/components/admin-dashboard-page/admin-dashboard-page.component';
import { RateDialogComponent } from './ng-modules/reporting/components/rate-dialog/rate-dialog.component';
import { SharedModule } from './ng-modules/shared/shared.module';
import { FirstUserPageComponent } from './ng-modules/auth/first-user-page/first-user-page.component';
import { UserSettingsPageComponent } from './ng-modules/reporting/components/user-settings-page/user-settings-page.component';
import { NewUserDialogComponent } from './ng-modules/reporting/components/new-user-dialog/new-user-dialog.component';
import { UserDashboardComponent } from './ng-modules/reporting/components/user-dashboard/user-dashboard.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from './ng-modules/shared/http-loader-factory';
import { ReportingHoursBookedDialogComponent } from './ng-modules/reporting/components/reporting-hours-booked-dialog/reporting-hours-booked-dialog.component';
import { MonthViewComponent } from './ng-modules/reporting/components/month-view/month-view.component';
import { RatePageComponent } from './ng-modules/reporting/components/rate-page/rate-page.component';
import { ShortenPipe } from './ng-modules/shared/pipes/shorten.pipe';
import { InvoicePageComponent } from './ng-modules/reporting/components/invoice-page/invoice-page.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    ActivityPageComponent,
    UserDialogComponent,
    ActivityDialogComponent,
    CustomerDialogComponent,
    ProjectDialogComponent,
    ReportingPageComponent,
    InvoicePageComponent,
    DateRangePipe,
    EmployeePipe,
    AdminDashboardPageComponent,
    RateDialogComponent,
    FirstUserPageComponent,
    UserSettingsPageComponent,
    NewUserDialogComponent,
    UserDashboardComponent,
    ReportingHoursBookedDialogComponent,
    MonthViewComponent,
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
    SharedModule,
    NavigationComponent,
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
  exports: [SharedModule],
})
export class AppModule {}
