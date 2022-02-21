import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { AppComponent } from './app.component';

const routes: Routes = [{path: "", component: AppComponent},{ path: 'activity/:id', component: ActivityComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
