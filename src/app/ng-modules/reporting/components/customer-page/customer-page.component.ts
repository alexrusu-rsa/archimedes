import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.sass'],
})
export class CustomerPageComponent implements OnInit, OnDestroy {
  allCustomers: Customer[] = [];
  allCustomersSubscription?: Subscription;
  deleteCustomerSubscription?: Subscription;
  customers: Customer[] = [];

  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  ngOnDestroy(): void {
    this.allCustomersSubscription?.unsubscribe();
    this.deleteCustomerSubscription?.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allCustomers = this.customers?.filter((customer: Customer) =>
      customer.customerName
        .toLowerCase()
        .includes(filterValue.trim().toLowerCase())
    );
  }

  getCustomers() {
    this.allCustomersSubscription = this.customerService
      .getCustomers()
      .subscribe((result) => {
        this.allCustomers = result;
        this.customers = result;
      });
  }

  addCustomer() {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      width: '33vw',
    });

    dialogRef.afterClosed().subscribe((newCustomer: Customer) => {
      if (newCustomer) this.allCustomers.push(newCustomer);
    });
  }

  editCustomer(customer: Customer) {
    this.dialog.open(CustomerDialogComponent, {
      data: customer,
    });
  }

  deleteCustomer(customerId: string) {
    this.allCustomers = this.allCustomers?.filter(
      (customer) => customer.id !== customerId
    );
    this.deleteCustomerSubscription = this.customerService
      .deleteCustomer(customerId)
      .subscribe();
  }
}
