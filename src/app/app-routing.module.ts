import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';
import { ActivityComponent } from './activity/activity.component';
import { AppComponent } from './app.component';
import { DayChooserComponent } from './day-chooser/day-chooser.component';
import { DayComponent } from './day/day.component';
import { EmployeeComponent } from './employee/employee.component';
import { TestEmployeesComponent } from './test-employees/test-employees.component';

const routes: Routes = [
  { path: 'day', component: DayComponent },
  { path: 'activity/:id', component: ActivityComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'employee/:id', component: EmployeeComponent },
  { path: 'testemployees', component: TestEmployeesComponent },
  { path: 'daychooser', component: DayChooserComponent },
  { path: 'day/:id', component: DayComponent },
  { path: 'dialog/activity/:id', component: ActivityDialogComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
