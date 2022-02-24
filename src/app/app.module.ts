import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivityComponent } from './activity/activity.component';
import { HttpClientModule } from '@angular/common/http';
import { DayComponent } from './day/day.component';
import { EmployeeComponent } from './employee/employee.component';
import { TestEmployeesComponent } from './test-employees/test-employees.component';

@NgModule({
  declarations: [AppComponent, ActivityComponent, DayComponent, EmployeeComponent, TestEmployeesComponent],
  imports: [BrowserModule, AppRoutingModule, MaterialModule, BrowserAnimationsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
