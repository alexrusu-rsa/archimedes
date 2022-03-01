import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayChooserComponent } from './day-chooser/day-chooser.component';
import { DayComponent } from './day/day.component';

const routes: Routes = [
  { path: 'day', component: DayComponent },
  { path: 'active-day', component: DayChooserComponent },
  { path: 'day/:id', component: DayComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
