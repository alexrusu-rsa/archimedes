import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core/datetime';
import { MatDatepicker } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { Customer } from 'src/app/models/customer';
import { ActivityService } from 'src/app/services/activity.service';
import { CustomerService } from 'src/app/services/customer.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.sass'],
})
export class InvoicePageComponent implements OnInit {
  allCustomers?: Customer[];
  allCustomersSub?: Subscription;

  allActivitiesOfMonthYear?: Activity[];
  allActivitiesOfMonthYearSub?: Subscription;

  constructor(
    private customerService: CustomerService,
    private activityService: ActivityService
  ) {}

  dateChanges() {
    return;
  }
  

  getActivitiesOfMonthYear(month: string, year: string) {
    this.allActivitiesOfMonthYearSub = this.activityService
      .getActivitiesOfMonthYear(month, year)
      .subscribe((result: Activity[]) => {
        this.allActivitiesOfMonthYear = result;
        console.log(result);
      });
  }

  getAllCustomers() {
    this.allCustomersSub = this.customerService
      .getCustomers()
      .subscribe((result) => {
        this.allCustomers = result;
      });
  }
  downloadXLSX(customerId: string) {
    this.customerService
      .getCustomerInvoiceXLSX(customerId)
      .subscribe((response: any) => {
        window.location.href = response.url;
      });
  }
  downloadPDF(customerId: string) {
    this.customerService
      .getCustomerInvoicePDF(customerId)
      .subscribe((response: any) => {
        window.location.href = response.url;
      });
  }

  ngOnInit(): void {
    this.getAllCustomers();
    this.getActivitiesOfMonthYear('04', '2022');
    if (this.allActivitiesOfMonthYear)
      console.log(this.allActivitiesOfMonthYear);
  }
}
