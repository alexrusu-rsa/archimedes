import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { AppComponent } from './app.component';
import { DayComponent } from './day/day.component';
import { EmployeeComponent } from './employee/employee.component';
import { TestEmployeesComponent } from './test-employees/test-employees.component';

const routes: Routes = [
  { path: 'day', component: DayComponent },
  { path: 'activity/:id', component: ActivityComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'employee/:id', component: EmployeeComponent },
  { path: 'testemployees', component: TestEmployeesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
