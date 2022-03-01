import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveDayComponent } from './active-day/active-day.component';
import { DayComponent } from './day/day.component';

const routes: Routes = [
  { path: 'day', component: DayComponent },
  { path: 'active-day', component: ActiveDayComponent },
  { path: 'day/:id', component: DayComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
