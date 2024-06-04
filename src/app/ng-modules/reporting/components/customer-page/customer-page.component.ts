import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer-service/customer.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import {
  DeleteConfirmationDialogComponent,
  deleteConfirmationDialogPreset,
} from '../../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Icons } from 'src/app/models/icons.enum';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.sass'],
})
export class CustomerPageComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  icons = Icons;
  allCustomers: Customer[] = [];
  customers: Customer[] = [];

  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCustomers();
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
    this.customerService
      .getCustomers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.allCustomers = result;
        this.customers = result;
      });
  }

  addCustomer() {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe((newCustomer: Customer) => {
      if (newCustomer) this.allCustomers.push(newCustomer);
    });
  }

  editCustomer(customer: Customer) {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      data: customer,
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe((updatedCustomer: Customer) => {
      this.allCustomers.forEach((customer) => {
        if (customer.id === updatedCustomer.id) {
          customer = updatedCustomer;
        }
      });
    });
  }

  deleteCustomer(customerId: string) {
    const dialogRef = this.dialog.open(
      DeleteConfirmationDialogComponent,
      deleteConfirmationDialogPreset
    );
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.allCustomers = this.allCustomers?.filter(
          (customer) => customer.id !== customerId
        );
        this.customerService
          .deleteCustomer(customerId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      }
    });
  }
}
