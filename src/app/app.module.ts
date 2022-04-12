import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './ng-modules/material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDashboardComponent } from './ng-modules/reporting/components/user-activity/user-activity-reporting.component';
import { AuthModule } from './ng-modules/auth/auth.module';
import { SnackbarContentComponent } from './ng-modules/utils/snackbar-content/snackbar-content.component';
import { AuthInterceptor } from './ng-modules/auth/auth.interceptor';
import { UserDetailsComponent } from './ng-modules/reporting/components/user-details/user-details.component';
import { UserAddEditComponent} from './ng-modules/reporting/components/user-add-edit/user-add-edit.component';
import { ActivityAddEditComponent } from './ng-modules/reporting/components/activity-add-edit/activity-add-edit.component';
import { CustomerDialogComponent } from './ng-modules/reporting/components/customer-add-edit/customer-add-edit.component';
import { ProjectDialogComponent } from './ng-modules/reporting/components/project-add-edit/project-add-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    UserDashboardComponent,
    SnackbarContentComponent,
    UserDetailsComponent,
    UserAddEditComponent,
    ActivityAddEditComponent,
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
