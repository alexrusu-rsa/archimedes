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
import { AdminDashboardPageComponent } from './ng-modules/reporting/components/admin-dashboard-page/admin-dashboard-page.component';
import { RateDialogComponent } from './ng-modules/reporting/components/rate-dialog/rate-dialog.component';
import { FirstUserPageComponent } from './ng-modules/auth/first-user-page/first-user-page.component';
import { NewUserDialogComponent } from './ng-modules/reporting/components/new-user-dialog/new-user-dialog.component';
import { UserDashboardComponent } from './ng-modules/reporting/components/user-dashboard/user-dashboard.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from './core/translation/http-loader-factory';
import { ReportingHoursBookedDialogComponent } from './ng-modules/reporting/components/reporting-hours-booked-dialog/reporting-hours-booked-dialog.component';
import { MonthViewComponent } from './ng-modules/reporting/components/month-view/month-view.component';
import { RatePageComponent } from './ng-modules/reporting/components/rate-page/rate-page.component';
import { InvoicePageComponent } from './ng-modules/reporting/components/invoice-page/invoice-page.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { ToolbarComponent } from './core/layout/components/toolbar/toolbar.component';
import { ShortenPipe } from './features/activity/pipes/shorten/shorten.pipe';
import { ProjectidPipe } from './shared/pipes/projectid/projectid.pipe';
import { EmployeeidPipe } from './shared/pipes/employeeid/employeeid.pipe';
import { CustomerfromprojectidPipe } from './shared/pipes/customerfromprojectid/customerfromprojectid.pipe';
import { SettingsPageComponent } from './features/settings/pages/settings-page/settings-page.component';

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
    AdminDashboardPageComponent,
    RateDialogComponent,
    FirstUserPageComponent,
    NewUserDialogComponent,
    UserDashboardComponent,
    ReportingHoursBookedDialogComponent,
    MonthViewComponent,
    RatePageComponent,
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
    NavigationComponent,
    ToolbarComponent,
    ShortenPipe,
    ProjectidPipe,
    EmployeeidPipe,
    CustomerfromprojectidPipe,
    SettingsPageComponent,
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
  exports: [],
})
export class AppModule {}
