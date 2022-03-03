import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivityComponent } from './activity/activity.component';
import { HttpClientModule } from '@angular/common/http';
import { DayComponent } from './day/day.component';
import { ActiveDayComponent } from './active-day/active-day.component';
import { DatePipe } from '@angular/common';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';
import { EditActivityComponent } from './edit-activity/edit-activity.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
@NgModule({
  declarations: [
    AppComponent,
    ActivityComponent,
    DayComponent,
    ActiveDayComponent,
    ActivityDialogComponent,
    EditActivityComponent,
    LoginComponent,
    UserDashboardComponent,
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
