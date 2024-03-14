import { NgModule } from '@angular/core';
import { CustomerFacade } from './customer.facade';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material/material.module';
import { CustomerPageComponent } from './components/customer-page/customer-page.component';
import { CustomerDialogComponent } from './components/customer-dialog/customer-dialog.component';
import { CustomerRoutingModule } from './customer-routing.module';

@NgModule({
  declarations: [CustomerPageComponent, CustomerDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
  ],
  exports: [CustomerPageComponent, CustomerDialogComponent],
  providers: [CustomerFacade],
})
export class CustomerModule {}
